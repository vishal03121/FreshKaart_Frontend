$("document").ready(() => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart !== null) {
    $(".cart-items-count").html(cart.products.length);
  }
  const search = document.getElementById("searchBoxBig")
  if(screen.availWidth <= 992){
    if(search) {
      search.style.display="block";
      search.className="d-flex";
    }
  }
  else{
    if(search){
      search.style.display="none";
      search.className="";
    }
  }
});

$(window).resize(() => {
  const search = document.getElementById("searchBoxBig")
  if(screen.availWidth <= 992){
    if(search) {
      search.style.display="block";
      search.className="d-flex";
    }
  }
  else{
    if(search){
      search.style.display="none";
      search.className="";
    }
  }
});

const logout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  location.reload();
};

//----------------------validators----------------------------------
const validateName = (name, id) => {
  if (name.length == 0) {
    document.getElementById(id).focus();
    return {
      response: false,
      message: "Name Field Must Not be Empty",
    };
  }
  return {
    response: true,
  };
};
const validateEmail = (email, id) => {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  if (email.match(validRegex)) {
    return {
      response: true,
    };
  }
  document.getElementById(id).focus();
  return {
    response: false,
    message: "Invalid Email",
  };
};
const validatePhoneNumber = (mobile, id) => {
  let phoneno = /^[6-9]{1}\d{9}$/;
  if (mobile.match(phoneno)) {
    return {
      response: true,
    };
  } else {
    document.getElementById(id).focus();
    return {
      response: false,
      message: "Invalid Phone Number",
    };
  }
};
const validatePassword = (password, confirmPassword, id1, id2) => {
  if (password.length < 8) {
    document.getElementById(id1).focus();
    return {
      response: false,
      message: "Password Must be of at least 8 characters",
    };
  } else if (password != confirmPassword) {
    document.getElementById(id2).focus();
    return {
      response: false,
      message: "Confirm Password & Passwrod must be same",
    };
  }
  return {
    response: true,
  };
};
const validateTermsCondition = (cb) => {
  if (cb.checked === true) {
    return {
      response: true,
    };
  }
  cb.focus();
  return {
    response: false,
    message: "Please Check Agree to Terms & Conditions",
  };
};

const validatePasswordSingle = (password, id) => {
  if (password.length < 8) {
    document.getElementById(id).focus();
    return {
      response: false,
      message: "Password Must be of at least 8 characters",
    };
  }
  return {
    response: true,
  };
};
const validateOtp = (otp, id) => {
  if (otp.length == 6 && !isNaN(otp)) {
    return {
      response: true,
    };
  }
  document.getElementById(id).focus();
  return {
    response: false,
    message: "Please Enter Valid 6 digit OTP",
  };
};

const validateAddress = (address, id) => {
  if (address.length == 0) {
    document.getElementById(id).focus();
    return {
      response: false,
      message: "Please Give Address with more than 30 Characters",
    };
  }
  return {
    response: true,
  };
}


//------------------------validators end------------------------------

// --------------------- to load categories dropdown in navbar start----------------------------
const loadNavbarCategories = () => {
  fetch("https://freshkartapi.herokuapp.com/productCategories")
    .then((res) => res.json())
    .then((resData) => {
      let prodCatId = localStorage.getItem("prodCatId");
      if (prodCatId === null) {
        localStorage.setItem("prodCatId", resData.categories[0]._id);
      }
      resData.categories.forEach((cat) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <li><a class="dropdown-item" href="products.html" onclick="setProdCatId('${cat._id}')"> ${cat.category} </a></li>
      `;
        document.getElementById("navbarCategoryDropdown").append(li);
      });
      prodCatId = localStorage.getItem("prodCatId");
      if (prodCatId === null) {
        prodCatId = resData.categories[0]._id;
        localStorage.setItem("prodCatId", prodCatId);
      }
      const li1 = document.createElement("li");
      const li2 = document.createElement("li");
      li1.innerHTML = `<hr class="dropdown-divider">`;
      li2.innerHTML = `
        <li><a class="dropdown-item" href="index.html#main-all-categories">View All</a></li>
      `;
      document.getElementById("navbarCategoryDropdown").append(li1);
      document.getElementById("navbarCategoryDropdown").append(li2);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};
loadNavbarCategories();
// --------------------- to load categories dropdown in navbar end----------------------------

const loadNavbarLogin = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token && userId) {
    let status;
    fetch("https://freshkartapi.herokuapp.com/user/" + userId,{
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then((res) => {
        status = res.status;
        return res.json()
      })
      .then((result) => {
        if(status===200 || status===201){
          document.getElementById("loginNavBarDisplay").innerHTML = result.name;
          document.getElementById("loggedInName").value = result.name;
          document.getElementById("loggedInEmail").value = result.email;
          document.getElementById("loggedInMobile").value = result.mobile;
        }
        else{
          logout();
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  } else {
    document.getElementById("loginNavBarDisplay").innerHTML = "Login/Register";
  }
};
loadNavbarLogin();

const checkProfileCLick = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token && userId) {
    $("#profileModal").modal("toggle");
  } else {
    // logout();
    $("#loginModal").modal("toggle");
    document.getElementById("loggedInName").value = "";
    document.getElementById("loggedInEmail").value = "";
    document.getElementById("loggedInMobile").value = "";
    document.getElementById("loginNavBarDisplay").innerHTML = "Login/Register";
  }
};

// --------------------- to load categories index page start----------------------------
const loadIndexPage = () => {
  fetch("https://freshkartapi.herokuapp.com/productCategories")
    .then((res) => res.json())
    .then((resData) => {
      if (resData.categories.length > 0) {
        resData.categories.forEach((cat) => {
          const div = document.createElement("div");
          div.className = "col";
          div.innerHTML = `
          <div class="col">
            <a href="products.html" class="link-color-black" onclick="setProdCatId('${cat._id}')">
              <div class="card">
                <img src="https://freshkartapi.herokuapp.com${cat.imageUrl}" class="card-img-top zoom"
                  alt="">
                <div class="card-body">
                  <h5 class="card-title text-center">${cat.category}</h5>
                </div>
              </div>
            </a>
          </div>
        `;
          document.getElementById("categoriesTable").appendChild(div);
        });
        document.getElementById("loadingCategories").remove();
      } else {
        const h1 = document.createElement("h1");
        h1.className = "display-6 text-center p-3 m-5";
        h1.innerHTML = "No Categories to show";
        document.getElementById("main-all-categories").appendChild(h1);
        document.getElementById("loadingCategories").remove();
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};
// --------------------- to load categories index page end----------------------------

//--------------------------------signup functions start------------------------------------

const signUpUser = () => {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signUpEmail").value;
  const mobile = document.getElementById("signUpPhoneNumber").value;
  const password = document.getElementById("signUpPassword").value;
  const confirmPassword = document.getElementById(
    "signUpPasswordConfirm"
  ).value;
  const checkbox = document.getElementById("signUpAgree");
  let valid = validateName(name, "signupName");
  if (valid.response) {
    valid = validateEmail(email, "signUpEmail");
  }
  if (valid.response) {
    valid = validatePhoneNumber(mobile, "signUpPhoneNumber");
  }
  if (valid.response) {
    valid = validatePassword(
      password,
      confirmPassword,
      "signUpPassword",
      "signUpPasswordConfirm"
    );
  }
  if (valid.response) {
    valid = validateTermsCondition(checkbox);
  }
  if (valid.response) {
    let status;
    fetch("https://freshkartapi.herokuapp.com/signup", {
      method: "PUT",
      body: JSON.stringify({
        email: email,
        mobile: mobile,
        name: name,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if (status === 201) {
          $("#registerModal").modal("hide");
          $("#otpModal").modal("show");
          const btn = document.getElementById("submitOtpSignUp");
          btn.setAttribute(
            "onclick",
            "submitOTPsignUp('" + result.signUpId + "')"
          );
        } else {
          $("#signUpToastMessage").html(result.message);
          $("#signUpToast").toast("show");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  } else {
    $("#signUpToastMessage").html(valid.message);
    $("#signUpToast").toast("show");
  }
};



const submitOTPsignUp = (signUpId) => {
  const otp = document.getElementById("signUpOtp").value;
  const isValidOtp = validateOtp(otp, "signUpOtp");

  if (isValidOtp.response) {
    let status;
    fetch("https://freshkartapi.herokuapp.com/validateSignUp", {
      method: "PUT",
      body: JSON.stringify({
        userId: signUpId,
        token: otp,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if (status == 201) {
          $("#otpModal").modal("hide");
          $("#loginModal").modal("toggle");
          $("#loginToastMessage").html(
            "Account Created Successfully!!!<br>Please Login to Continue!"
          );
          $("#loginToast").toast("show");
        } else {
          $("#otpSignUpToastMessage").html(result.message);
          $("#otpSignUpToast").toast("show");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  } else {
    $("#otpSignUpToastMessage").html(isValidOtp.message);
    $("#otpSignUpToast").toast("show");
  }
};

//-------------------------------------signup functions end-----------------------------------

//----------------------------------profile modification start----------------------------------
const editProfileModalClosed = () => {
  document.getElementById("loggedInName").disabled = true;
  document.getElementById("loggedInMobile").disabled = true;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if (token && userId) {
    let status;
    fetch("https://freshkartapi.herokuapp.com/user/" + userId,{
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then((res) => {
        status=res.status
        return res.json()
      })
      .then((result) => {
        if(status===200 || status===201){
          document.getElementById("loggedInName").value = result.name;
          document.getElementById("loggedInMobile").value = result.mobile;
        }
        else{
          logout();
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }
  document
    .getElementById("editProfileBtn")
    .setAttribute("onclick", "editProfile()");
  document.getElementById("profileModalClose").removeAttribute("onclick");
};
const editProfile = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if (token && userId) {
    document.getElementById("loggedInName").disabled = false;
    document.getElementById("loggedInMobile").disabled = false;
    document
      .getElementById("editProfileBtn")
      .setAttribute("onclick", "updateProfile()");
    document
      .getElementById("profileModalClose")
      .setAttribute("onclick", "editProfileModalClosed()");
  } else {
    logout();
  }
};
const updateProfile = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const name = document.getElementById("loggedInName").value;
  const mobile = document.getElementById("loggedInMobile").value;
  if (token && userId) {
    let valid = validateName(name, "loggedInName");
    if (valid.response) {
      valid = validatePhoneNumber(mobile, "loggedInMobile");
    }
    if (valid.response) {
      let status;
      fetch("https://freshkartapi.herokuapp.com/updateUserProfile", {
        method: "PUT",
        body: JSON.stringify({
          userId: userId,
          name: name,
          mobile: mobile,
        }),
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token
        },
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((result) => {
          if (status === 201 || status==200) {
            location.reload();
          } 
          else if(status===500){
            logout();
          }
          else {
            $("#editProfileToastMessage").html(result.message);
            $("#editProfileToast").toast("show");
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    } else {
      $("#editProfileToastMessage").html(valid.message);
      $("#editProfileToast").toast("show");
    }
  } else {
    logout();
  }
};

const changePassword = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const oldPassword = document.getElementById("changePasswordOld").value;
  const newPassword = document.getElementById("changePasswordNew").value;
  const newPasswordConfirm = document.getElementById(
    "changePasswordNewConfirm"
  ).value;
  if (token && userId) {
    let valid = validatePasswordSingle(oldPassword, "changePasswordOld");
    if (valid.response) {
      valid = validatePassword(
        newPassword,
        newPasswordConfirm,
        "changePasswordNew",
        "changePasswordNewConfirm"
      );
    }
    if (valid.response) {
      let status;
      fetch("https://freshkartapi.herokuapp.com/changePassword", {
        method: "PUT",
        body: JSON.stringify({
          userId: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token
        },
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((result) => {
          if (status === 201 || status===200) {
            location.reload();
          }
          else if(status===500) {
            logout();
          }
          else {
            $("#changePasswordToastMessage").html(result.message);
            $("#chnagePasswordToast").toast("show");
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    } else {
      $("#changePasswordToastMessage").html(valid.message);
      $("#chnagePasswordToast").toast("show");
    }
  } else {
    logout();
  }
};
//----------------------------------profile modification end-----------------------------------

//-------------------------------------forgot password functions--------------------------------------
const resendforgotPasswordOtp = () => {
  const email = document.getElementById("forgotPasswordEmail").value;
  const valid = validateEmail(email, "forgotPasswordEmail");
  if (valid.response) {
    let status;
    fetch("https://freshkartapi.herokuapp.com/resendOtp", {
      method: "PUT",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if (status === 200) {
          document.getElementById("resendForgotPasswordOtpBtn").disabled = true;
        }
        $("#forgotPasswordToastMessage").html(result.message);
        $("#forgotPasswordToast").toast("show");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  } else {
    $("#forgotPasswordToastMessage").html(valid.message);
    $("#forgotPasswordToast").toast("show");
  }
};

const forgotPassword = () => {
  const email = document.getElementById("forgotPasswordEmail").value;
  const newPassword = document.getElementById("forgotNewPassword").value;
  const newPasswordConfirm = document.getElementById("forgotNewPasswordConfirm").value;
  const otp = document.getElementById("forgotPasswordOtp").value;
  let valid = validateEmail(email, "forgotPasswordEmail");
  if(valid.response){
    valid = validatePassword(newPassword, newPasswordConfirm, "forgotNewPassword", "forgotNewPasswordConfirm");
  }
  if(valid.response){
    valid = validateOtp(otp, "forgotPasswordOtp");
  }
  if(valid.response){
    let status;
    fetch("https://freshkartapi.herokuapp.com/forgotPassword", {
      method: "PUT",
      body: JSON.stringify({
        email: email,
        newPassword:newPassword,
        otp:otp
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if (status === 201) {
          document.getElementById("resendForgotPasswordOtpBtn").disabled = true;
          setTimeout(()=>{
            $("#forgotPasswordModal").modal("hide");
          },2000)
        }
        $("#forgotPasswordToastMessage").html(result.message);
        $("#forgotPasswordToast").toast("show");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }
  else{
    $("#forgotPasswordToastMessage").html(valid.message);
    $("#forgotPasswordToast").toast("show");
  }
}
//-------------------------------------forgot password end--------------------------------------

//--------------------------------login functions start------------------------------

const loginUser = () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  let valid = validateEmail(email, "loginEmail");
  if (valid.response) {
    valid = validatePasswordSingle(password, "loginPassword");
  }
  if (valid.response) {
    let status;
    fetch("https://freshkartapi.herokuapp.com/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if (status === 200) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("userId", result.userId);
          localStorage.setItem("cart", JSON.stringify(result.cart));
          $("#loginModal").modal("hide");
          location.reload();
        } else {
          $("#loginToastMessage").html(result.message);
          $("#loginToast").toast("show");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  } else {
    $("#loginToastMessage").html(valid.message);
    $("#loginToast").toast("show");
  }
};
//------------------------------login functions end--------------------------

// --------------------- to load categories sidebar start----------------------------
const loadProductsPage = () => {
  fetch("https://freshkartapi.herokuapp.com/productCategories")
    .then((res) => res.json())
    .then((resData) => {
      let prodCatId = localStorage.getItem("prodCatId");
      if (prodCatId === null) {
        prodCatId = resData.categories[0]._id;
        localStorage.setItem("prodCatId", prodCatId);
      }
      resData.categories.forEach((cat) => {
        if (cat._id == prodCatId) {
          $("#categoryNameTitle").html(cat.category.toUpperCase());
          document.title = cat.category;
        }
        const a = document.createElement("a");
        a.setAttribute("href", "products.html");
        a.setAttribute("onclick", "setProdCatId('" + cat._id + "')");
        a.className = "list-group-item list-group-item-action";
        a.innerHTML = `
        <div class="d-flex w-100 justify-content-start align-items-center">
          <span class="fa fa-tasks fa-fw mr-3"></span>
          <span class="">${cat.category}</span>
        </div>
      `;
        document.getElementById("sidebarCategories").append(a);
      });
      document.getElementById("loadingCategories").remove();
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });

  let prodCatId = localStorage.getItem("prodCatId");
  let state = JSON.parse(localStorage.getItem("state"));
  if (state == null) {
    state = {
      perPage: 16,
      currentPage: 1,
    };
  }
  if (prodCatId === null) {
    setTimeout(() => {
      document.getElementById("loadingProducts").remove();
      pagination(0);
    }, 4000);
  } else {
    fetch(
      "https://freshkartapi.herokuapp.com/products/" +
        prodCatId +
        "?page=" +
        state.currentPage
    )
      .then((res) => res.json())
      .then((resData) => {
        $("#productListRow").empty();
        if (resData.products.length <= 0) {
          const h1 = document.createElement("h1");
          h1.className = "display-6 text-center p-3 m-5";
          h1.innerHTML = "No Products to show";
          document.getElementById("productsViewTable").appendChild(h1);
          const image = document.createElement("img");
          image.setAttribute("src", "./resources/images/logos_images/opps.png");
          image.className = "img-fluid mx-auto d-block";
          image.style.width = "50%";
          document.getElementById("productsViewTable").appendChild(image);
          $("#loadingProducts").remove();
        } else {
          if (state.currentPage == 1) {
            const prevBtn = document.getElementById("prevPageBtn");
            if (prevBtn !== null) prevBtn.remove();
          }
          if (state.currentPage > 1) {
            const btn = document.createElement("button");
            btn.id = "prevPageBtn";
            btn.className = "btn btn-primary btn-sm my-bg-blue-dark mt-4";
            btn.innerHTML = `&#171 Previous`;
            btn.setAttribute("onclick", "pagination(" + -1 + ")");
            btn.setAttribute("type", "submit");
            document.getElementById("productsViewTable").appendChild(btn);
          }
          if (resData.totalItems > state.perPage) {
            const btn = document.createElement("button");
            btn.id = "nextPageBtn";
            btn.className =
              "btn btn-primary btn-sm my-bg-blue-dark my-class-float-right mt-4";
            btn.innerHTML = `Next &#187`;
            btn.setAttribute("onclick", "pagination(" + 1 + ")");
            btn.setAttribute("type", "submit");
            document.getElementById("productsViewTable").appendChild(btn);
          }
          if (state.currentPage * state.perPage >= resData.totalItems) {
            $("#nextPageBtn").remove();
          }
          resData.products.forEach((prod) => {
            const div = document.createElement("div");
            div.className = "col";
            div.innerHTML = `
          <div class="card">
              <a href="#" data-bs-toggle="modal" data-bs-target="#productModal"><img
                      src="https://freshkartapi.herokuapp.com${prod.imageUrl[0]}" onclick='getProductModalData("${prod._id}")'
                      class="card-img-top zoom" alt="..."></a>
                    <div class="card-body text-center">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">Contents: ${prod.contents}</p>
              <p class="card-text"><span class="text-muted me-4">MRP:
                      <span>&#8377;</span>${prod.mrp}</span><span class="text-dark ms-4">Our Price:
                      <span>&#8377;</span>${prod.ourPrice}</span></p>
          </div>
          <div class="card-body">
              <label class="my-1 mr-2" for="inlineFormCustomSelectPref">QTY:</label>
              <input type="number" class="inline-form-control qty-width ${prod._id}" value="1" min="1" max="4">
          <button type="button" id="addToCartBtn" class="btn btn-primary btn-sm my-bg-blue-dark my-class-float-right" onclick="addToCartbtn('${prod._id}',false)">Add
              to Cart</button>
          </div>
      </div>
          `;
            document.getElementById("productListRow").appendChild(div);
          });
          document.getElementById("loadingProducts").remove();
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    localStorage.setItem("state", JSON.stringify(state));
  }
};
// --------------------- to load categories sidebar end----------------------------

const sideBarViewProfile = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token && userId) {
    $("#profileModal").modal("show");
  } else {
    // logout();
    $("#loginModal").modal("show");
    document.getElementById("loggedInName").setAttribute("placeholder", "Name");
    document
      .getElementById("loggedInEmail")
      .setAttribute("placeholder", "email");
    document
      .getElementById("loggedInMobile")
      .setAttribute("placeholder", "Mobile");
  }
};

const pagination = (toPage) => {
  $("#productListRow").empty();
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;
  const prevBtn = document.getElementById("prevPageBtn");
  if (prevBtn != null) prevBtn.remove();
  const nextBtn = document.getElementById("nextPageBtn");
  if (nextBtn != null) nextBtn.remove();

  const div = document.createElement("div");

  div.className = "d-flex justify-content-center m-5";
  div.id = "loadingProducts";
  div.innerHTML = `
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
  `;
  document.getElementById("productsViewTable").appendChild(div);

  let state = JSON.parse(localStorage.getItem("state"));
  if (state == null) {
    state = {
      perPage: 16,
      currentPage: 1,
    };
  }
  state.currentPage = state.currentPage + toPage;
  const prodCatId = localStorage.getItem("prodCatId");
  fetch(
    "https://freshkartapi.herokuapp.com/products/" + prodCatId + "?page=" + state.currentPage
  )
    .then((res) => res.json())
    .then((resData) => {
      if (resData.products.length <= 0) {
        const h1 = document.createElement("h1");
        h1.className = "display-6 text-center p-3 m-5";
        h1.innerHTML = "No Products to show";
        document.getElementById("productsViewTable").appendChild(h1);
        $("#loadingProducts").remove();
      } else {
        if (state.currentPage == 1) {
          const prevBtn = document.getElementById("prevPageBtn");
          if (prevBtn != null) prevBtn.remove();
        }
        if (state.currentPage > 1) {
          const btn = document.createElement("button");
          btn.id = "prevPageBtn";
          btn.className = "btn btn-primary btn-sm my-bg-blue-dark mt-4";
          btn.innerHTML = `&#171 Previous`;
          btn.setAttribute("onclick", "pagination(" + -1 + ")");
          btn.setAttribute("type", "submit");
          document.getElementById("productsViewTable").appendChild(btn);
        }
        if (resData.totalItems > state.perPage) {
          const btn = document.createElement("button");
          btn.id = "nextPageBtn";
          btn.className =
            "btn btn-primary btn-sm my-bg-blue-dark my-class-float-right mt-4";
          btn.innerHTML = `Next &#187`;
          btn.setAttribute("onclick", "pagination(" + 1 + ")");
          btn.setAttribute("type", "submit");
          document.getElementById("productsViewTable").appendChild(btn);
        }
        if (state.currentPage * state.perPage >= resData.totalItems) {
          $("#nextPageBtn").remove();
        }
        resData.products.forEach((prod) => {
          const div = document.createElement("div");
          div.className = "col";
          div.innerHTML = `
          <div class="card">
              <a href="#" data-bs-toggle="modal" data-bs-target="#productModal"><img
                      src="https://freshkartapi.herokuapp.com${prod.imageUrl[0]}" onclick='getProductModalData("${prod._id}")'
                      class="card-img-top zoom" alt="..."></a>
                    <div class="card-body text-center">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">Contents: ${prod.contents}</p>
              <p class="card-text"><span class="text-muted me-4">MRP:
                      <span>&#8377;</span>${prod.mrp}</span><span class="text-dark ms-4">Our Price:
                      <span>&#8377;</span>${prod.ourPrice}</span></p>
          </div>
          <div class="card-body">
              <label class="my-1 mr-2" for="inlineFormCustomSelectPref">QTY:</label>
              <input type="number" class="inline-form-control qty-width ${prod._id}" value="1" min="1" max="4">
          <button type="button" id="addToCartBtn" class="btn btn-primary btn-sm my-bg-blue-dark my-class-float-right" onclick="addToCartbtn('${prod._id}',false)">Add
              to Cart</button>
          </div>
      </div>
          `;
          document.getElementById("productListRow").appendChild(div);
        });
        document.getElementById("loadingProducts").remove();
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  localStorage.setItem("state", JSON.stringify(state));
};

// --------------------- to load products start----------------------------
const setProdCatId = (prodCatId) => {
  const state = {
    perPage: 16,
    currentPage: 1,
  };
  localStorage.setItem("prodCatId", prodCatId);
  localStorage.setItem("state", JSON.stringify(state));
};

// --------------------- to load categories in footer start----------------------------
const loadFooterCategories = () => {
  fetch("https://freshkartapi.herokuapp.com/productCategories")
    .then((res) => res.json())
    .then((resData) => {
      for (let i = 0; i < 3 && i < resData.categories.length; i++) {
        const p = document.createElement("p");
        p.innerHTML = `<a href="products.html" class="link-dark" onclick="setProdCatId('${resData.categories[i]._id}')">${resData.categories[i].category}</a>`;
        document.getElementById("footerCategories").appendChild(p);
      }
      const p = document.createElement("p");
      p.innerHTML = `<a href="index.html#main-all-categories" class="link-dark">View All</a>`;
      document.getElementById("footerCategories").appendChild(p);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};
loadFooterCategories();
// --------------------- to load categories footer in footer end----------------------------

// ----------------------------------sidebar start---------------------------------
//sidebar collapse expand
const SidebarCollapse = () => {
  $("#sidebar-container").toggleClass("sidebar-expanded sidebar-collapsed");
  // Treating d-flex/d-none on separators with title
  var SeparatorTitle = $(".sidebar-separator-title");
  if (SeparatorTitle.hasClass("d-flex")) {
    SeparatorTitle.removeClass("d-flex");
  } else {
    SeparatorTitle.addClass("d-flex");
  }
};

// ----------------------------------sidebar end---------------------------------

// --------------------------------------fetching product data for product view modal---------------------------
const getProductModalData = (prodId) => {
  $("#productToastInside").toast("hide");
  fetch("https://freshkartapi.herokuapp.com/product/" + prodId)
    .then((res) => res.json())
    .then((resData) => {
      document.getElementById("productModal-title").innerHTML =
        resData.product.name;
      document.getElementById("prod-name").innerHTML = resData.product.name;
      document.getElementById("prod-description").innerHTML =
        resData.product.description;
      document.getElementById("prod-content").innerHTML =
        resData.product.contents;
      document.getElementById("prod-mrp").innerHTML = resData.product.mrp;
      document.getElementById("prod-ourprice").innerHTML =
        resData.product.ourPrice;

      document.getElementById("prod-img-0").src =
        "https://freshkartapi.herokuapp.com" + resData.product.imageUrl[0];
      document.getElementById("prod-img-1").src =
        "https://freshkartapi.herokuapp.com" + resData.product.imageUrl[1];
      document.getElementById("prod-img-2").src =
        "https://freshkartapi.herokuapp.com" + resData.product.imageUrl[2];

      document
        .getElementById("add-to-cart-btn")
        .setAttribute(
          "onclick",
          "addToCartbtn('" + resData.product._id+ "',true)"
        );
      document
        .getElementById("product-qty-2").className = "inline-form-control " + resData.product._id;
    })
    .catch((err) => console.log(err));
};

// --------------------add to cart-------------------------
const addToCartbtn = (prodId, inside) => {
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let qty,
    clsId = 0,
    toastInside = "";
  qty = document.getElementsByClassName(prodId)[clsId].value;
  if (inside) {
    clsId = 1;
    toastInside = "Inside";
    qty = document.getElementById("product-qty-2").value; 
  }
  qty = parseInt(qty);
  
  $("#productToastMessage"+toastInside).html("-");
  let status;
  fetch("https://freshkartapi.herokuapp.com/checkProduct/" + prodId+'/'+qty)
    .then((res) =>{
      status=res.status;
      return res.json();
    })
    .then((resData) => {
      if(status==200){
        if(token && userId){

          let status;
          fetch("https://freshkartapi.herokuapp.com/addProductToCart", {
            method: "PUT",
            body: JSON.stringify({
              userId: userId,
              prodId: prodId,
              qty: qty,
            }),
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + token
            },
          })
            .then((res) => {
              status = res.status;
              return res.json();
            })
            .then((result) => {
              if (status === 201 || status===200) {
                cart = result.cart;
                localStorage.setItem("cart", JSON.stringify(cart));
                $("#productToastMessage"+toastInside).html(result.message);
                $("#productToast" + toastInside).toast("show");
                $(".cart-items-count").html(cart.products.length);
              }
              else if(status===500) {
                logout();
              }
              else {
                $("#productToastMessage"+toastInside).html(result.message);
                $("#productToast" + toastInside).toast("show");
              }
            })
            .catch((err) => {
              if (err) {
                console.log(err);
              }
        });
        }
        else{
            if (cart == null){
              cart = {
                orderValue: 0,
                products: [],
              };
            }
            let index = cart.products.findIndex((prod) => {
              return prod.productId === prodId;
            });
            if (index === -1) {
              //if logged in add to db
              cart.products.push({
                productId: prodId,
                qty: qty,
                ourPrice: resData.product.ourPrice,
                prodTotal: resData.product.ourPrice*qty,
              });
              cart.orderValue+=resData.product.ourPrice*qty
              $("#productToastMessage"+toastInside).html("Added Successfully");
              $("#productToast" + toastInside).toast("show");
              $(".cart-items-count").html(cart.products.length);
          }
          else if(cart.products[index].qty+qty<=4){
            cart.products[index].qty+=qty;
            $("#productToastMessage"+toastInside).html("Quantity Updated Successfully!!");
            $("#productToast" + toastInside).toast("show");
            localStorage.setItem("cart",cart);
          }
          else{
            $("#productToastMessage"+toastInside).html("Product Already In Cart");
            $("#productToast" + toastInside).toast("show");
          }
        }
      }
      else{
        $("#productToastMessage"+toastInside).html(resData.message);
        $("#productToast" + toastInside).toast("show");
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

// ------------------------view in cart btn -----------------------------
const viewCartbtn = () => {
  $("#cartToast").toast('hide');
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if(token && userId){
    document.getElementById("checkout-btn").disabled=false;
  }
  document.getElementById("cart-row-table").innerHTML = "";
  let totalCartVal = 0;
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart == null || cart.products.length === 0) {
    const h1 = document.createElement("h1");
    h1.className = "display-6 text-center p-3";
    h1.innerHTML = "Cart Empty!!!";
    document.getElementById("cart-row-table").appendChild(h1);
    const image = document.createElement("img");
    image.setAttribute("src", "./resources/images/logos_images/empty_cart.png");
    image.className = "img-fluid mx-auto d-block";
    image.style.width = "50%";
    document.getElementById("cart-row-table").appendChild(image);

    $("#checkout-btn").addClass("disabled");
  } else {
    $("#checkout-btn").removeClass("disabled");
    cart.products.forEach((prod) => {
      fetch("https://freshkartapi.herokuapp.com/product/" + prod.productId)
        .then((res) => res.json())
        .then((resData) => {
          const div = document.createElement("div");
          div.className = "col";
          div.id  = resData.product._id;
          div.innerHTML = `
                <div class="card mb-3">
                <span class="position-absolute top-0 translate-middle badge border border-light rounded-circle bg-light">
                    <button type="button" class="btn-close pull-right" aria-label="Close" onclick='removeCartItem(${JSON.stringify(
                      resData.product._id
                    )})'></button></span>
                <div class="row row-cols-1 g-0">
                    <div class="col-md-4">
                        <img src="https://freshkartapi.herokuapp.com${resData.product.imageUrl[0]}"
                        class="img-fluid rounded-start" alt="...">
                    </div>
                
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${resData.product.name}</h5>
                            <p class="my-0">Contents: ${
                              resData.product.contents
                            }</p>
                            <p class="my-0 text-muted">MRP:<span>&#8377;</span>${
                              resData.product.mrp
                            }<span class="text-dark my-class-float-right">QTY: ${
            prod.qty
          }</span></p>
                            <p class="my-0 text-dark">Our Price:<span>&#8377;</span>${
                              resData.product.ourPrice
                            }<span class="text-dark my-class-float-right">Total: <span>&#8377;</span>${
            resData.product.ourPrice * prod.qty
          }</span></p>
        
                        </div>
                    </div>
                </div>
            </div>
                `;
          totalCartVal += resData.product.ourPrice * prod.qty;
          document.getElementById("cart-row-table").appendChild(div);
          $("#total-value-cart").html(totalCartVal);
          let index = cart.products.findIndex((prd) => {
            return prd.pid === prod.pid;
          });
          cart.products[index].ourPrice = resData.product.ourPrice;
          cart.products[index].prodtotal = resData.product.ourPrice * prod.qty;
          cart.orderValue = totalCartVal;
          localStorage.setItem("cart", JSON.stringify(cart));
        })
        .catch((err) => console.log(err));
    });
  }
};

const removeCartItem = (prodId) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if(token && userId){
    let status;
      fetch("https://freshkartapi.herokuapp.com/removeFromCart", {
        method: "PUT",
        body: JSON.stringify({
          userId: userId,
          prodId: prodId,
        }),
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token
        },
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((result) => {
          if (status === 201 || status===200) {
            cart = result.cart;
            localStorage.setItem("cart", JSON.stringify(cart));
            $("#cartToastMessage").html(result.message);
            $(".cart-items-count").html(cart.products.length);
          }
          else if(status===500) {
            logout();
          }
          else {
            $("#cartToastMessage").html(result.message);
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
    });
  }
  let ele = document.getElementById("cart-row-table");
  ele.removeChild(document.getElementById(prodId));
  let cart = JSON.parse(localStorage.getItem("cart"));
  let index = cart.products.findIndex((prod) => {
    return prod.productId === prodId;
  });
  if (index != -1) {
    cart.orderValue -= cart.products[index].prodTotal;
    cart.products.splice(index, 1);
    $(".cart-items-count").html(cart.products.length);
    $("#total-value-cart").html(cart.orderValue);
  }

  if (ele.childElementCount == 0) {
    const h1 = document.createElement("h1");
    h1.className = "display-6 text-center p-3";
    h1.innerHTML = "Cart Empty!!!";
    document.getElementById("cart-row-table").appendChild(h1);
    const image = document.createElement("img");
    image.setAttribute("src", "./resources/images/logos_images/empty_cart.png");
    image.className = "img-fluid mx-auto d-block";
    image.style.width = "50%";
    document.getElementById("cart-row-table").appendChild(image);
    $(".cart-items-count").html(cart.products.length);
    document.getElementById("checkout-btn").disabled=true;
    $("#total-value-cart").html(0);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  $("#cartToastMessage").html("Removed");
  $("#cartToast").toast('show');
};



const placeOrder = () => {
  $("#checkoutToastMessage").html("-");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if (token && userId) {
    const name = document.getElementById("checkoutName").value;
    const mobile = document.getElementById("checkoutMobile").value;
    const address = document.getElementById("checkoutAddress").value;
    let valid = validateName(name, "checkoutName");
    if (valid.response) {
      valid = validatePhoneNumber(mobile, "checkoutMobile");
    }
    if (valid.response) {
      valid = validateAddress(address, "checkoutAddress");
    }
    if (valid.response) {
      let status;
      fetch("https://freshkartapi.herokuapp.com/placeOrder", {
        method: "PUT",
        body: JSON.stringify({
          userId: userId,
          name: name,
          address: address,
          mobile: mobile,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((result) => {
          if (status === 201 || status === 200) {
            localStorage.removeItem("cart");
            $("#checkoutToastMessage").html(result.message);
            $("#checkoutToast").toast("show");
            setTimeout(() => {
              location.replace("/viewOrders.html");
            }, 2000);
          } else if (status === 500) {
            logout();
          } else {
            $("#checkoutToastMessage").html(result.message);
            $("#checkoutToast").toast("show");
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    } else {
      $("#checkoutToastMessage").html(valid.message);
      $("#checkoutToast").toast("show");
    }
  } else {
    logout();
  }
};




const filterOrders = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const filter = $('.selectpicker').children("option:selected").val();

  if(userId && token){
    $("#viewOrderRow").empty()
    if(filter=="view_all") loadViewOrdersPage();
    else{
      const div = document.createElement("div");

      div.className = "d-flex justify-content-center m-5";
      div.id = "loadingOrders";
      div.innerHTML = `
                <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
      `;
      document.getElementById("view-Order-main").appendChild(div);




      let status;
      fetch("https://freshkartapi.herokuapp.com/ordersWithStatus" +"?userId="+userId +"&status="+filter,{
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if(status===200 || status===201){

          if(result.orders.length>0){
            if(document.getElementById("noOrder")) document.getElementById("noOrder").remove();
          result.orders.forEach((order) => {
            const d = new Date( order.createdAt );
            const date =  d.toLocaleString();
            let cancelBtn="";
            let cardBodyClass = "my-class-orders-color"
            if(order.status==="delivered" || order.status==="shipped") cardBodyClass +="-final";
            else if(order.status==="confirmed"){
              cardBodyClass +="-confirmed";
              cancelBtn = `<a href="#" class="btn btn-danger btn-sm my-bg-red-warn my-class-float-right" onclick="cancelOrder('${order._id}')">Cancel Order</a>'`
            }
            else if(order.status==="pending"){
              cardBodyClass +="-pending";
              cancelBtn = `<a href="#" class="btn btn-danger btn-sm my-bg-red-warn my-class-float-right" onclick="cancelOrder('${order._id}')">Cancel Order</a>'`
            }
            else {
              cardBodyClass +="-canceled";
            }
            const div = document.createElement("div");
            div.className="col";
            div.innerHTML = `
                <div class="card">
                    <div class="card-header">
                      <span>Order ID: ${order._id}</span>
                      <a href="#" class="btn btn-primary btn-sm my-bg-blue-dark my-class-float-right" onclick="viewOrder('${order._id}')">View Order</a>
                    </div>
                    <div class="card-body ${cardBodyClass}">
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Name: </span>${order.name}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Phone Number: </span>  ${order.mobile}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Address: </span>  ${order.address}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Status: </span>${capitalize(order.status)}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Order Value:</span> <span>&#8377;</span>${order.orderValue} </p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Payment Method: </span>${order.paymentMode}</p>
                      
                    </div>
                    <div class="card-footer text-muted">
                      Order Date: ${date}
                      ${cancelBtn}
                    </div>
                </div>
            `;
            document.getElementById("viewOrderRow").appendChild(div);
          })
        }
        else{
          if(document.getElementById("noOrder")) document.getElementById("noOrder").remove();
          const h1 = document.createElement("h1");
          h1.className = "display-6 text-center p-3 m-5";
          h1.id="noOrder"
          h1.innerHTML = "No Orders with Status: " + capitalize(filter);
          document.getElementById("view-Order-main").appendChild(h1);
          }
          if(document.getElementById("loadingOrders"))
          document.getElementById("loadingOrders").remove();
        }
        else if(status===500){
          logout();
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
      
    }
  }
  else{
    logout();
  }
};



const checkoutClick = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if(token && userId){
    $("#checkoutModal").modal("show");
  }
  else{
    $("#loginModal").modal("show");
  }
}

const viewOrder = (orderId) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if(token && userId){
    $("#viewSingleOrderRow").empty();
    let status;
        fetch("https://freshkartapi.herokuapp.com/viewOrder" +"/"+orderId,{
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + token,
          }
        })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((result) => {
          if(status===200 || status===201){
            $("#viewOrderId").html("Order Id: "+result.order._id)
            const d = new Date( result.order.createdAt );
            const date =  d.toLocaleString();
            result.order.products.forEach((product) => {
              const div = document.createElement("div");
              div.className="col";
              div.innerHTML = `
              <div class="card mb-3">
              <div class="row row-cols-1 g-0">
                  <div class="col-md-4">
                      <img src="https://freshkartapi.herokuapp.com${product.imageUrl}"
                      class="img-fluid rounded-start" alt="...">
                  </div>
              
                  <div class="col-md-8">
                      <div class="card-body">
                          <h5 class="card-title">${product.name}</h5>
                          <p class="my-0">Contents: ${product.contents}</p>
                          <p class="my-0 text-muted">MRP:<span>&#8377;</span>${product.mrp}<span class="text-dark my-class-float-right">QTY: ${product.qty}</span></p>
                          <p class="my-0 text-dark">Our Price:<span>&#8377;</span>${product.ourPrice}<span class="text-dark my-class-float-right">Total: <span>&#8377;</span>${product.qty*product.ourPrice}</span></p>
  
                      </div>
                  </div>
              </div>
          </div>
              `;
              document.getElementById("viewSingleOrderRow").appendChild(div);
            })
            $("#viewOrderDate").html("Order Date: "+date);
            $("#orderTotal").html(result.order.orderValue);
            $("#viewOrderModal").modal("show");
          }
          else if(status===500){
            logout();
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
  }
  else{
    logout();
  }
}


const resendCancelOrderOtp = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if(token && userId){
    let status;
    fetch("https://freshkartapi.herokuapp.com/resendOtp/" +userId, {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((result) => {
          if (status === 200 || status===201) {
            document.getElementById("resendCancelOrderOtpBtn").disabled = true;
          }
          $("#cancelOrderToastMessage").html(result.message);
          $("#cancelOrderToast").toast("show");
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
  }
  else{
    logout();
  }
}



const confirmCancel = (orderId) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if(token && userId){
    const otp = document.getElementById("cancelOrderOtp").value;
    let valid = validateOtp(otp, "cancelOrderOtp");
    if(valid.response){
      let status;
      fetch("https://freshkartapi.herokuapp.com/cancelOrder",{
        method: "PUT",
        body: JSON.stringify({
          orderId: orderId,
          otp: otp
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result)=>{
        $("#cancelOrderToastMessage").html(result.message);
        if(status===200 || status===201){
          setTimeout(()=>{
            location.reload();
          }, 2000);
        }
      $("#cancelOrderToast").toast("show");
      })
    }
    else{
      $("#cancelOrderToastMessage").html(valid.message);
      $("#cancelOrderToast").toast("show");
    }
  }
  else{
    logout();
  }
}

const cancelOrder = (orderId) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  if(token && userId){
    document.getElementById("confirmClickBtn").setAttribute("onclick", "confirmCancel('"+orderId+"')");
    $("#cancelOrderModalId").html("Cancel Order(Order Id: "+orderId+")")
    $("#cancelOrderModal").modal("show");
  }
  else{
    logout();
  }
}


const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

const loadViewOrdersPage = () => {
  fetch("https://freshkartapi.herokuapp.com/productCategories")
    .then((res) => res.json())
    .then((resData) => {
      let prodCatId = localStorage.getItem("prodCatId");
      if (prodCatId === null) {
        prodCatId = resData.categories[0]._id;
        localStorage.setItem("prodCatId", prodCatId);
      }
      resData.categories.forEach((cat) => {
        if (cat._id == prodCatId) {
          $("#categoryNameTitle").html(cat.category.toUpperCase());
        }
        const a = document.createElement("a");
        a.setAttribute("href", "products.html");
        a.setAttribute("onclick", "setProdCatId('" + cat._id + "')");
        a.className = "list-group-item list-group-item-action";
        a.innerHTML = `
        <div class="d-flex w-100 justify-content-start align-items-center">
          <span class="fa fa-tasks fa-fw mr-3"></span>
          <span class="">${cat.category}</span>
        </div>
      `;
        document.getElementById("sidebarCategories").append(a);
      });
      if(document.getElementById("loadingCategories"))
        document.getElementById("loadingCategories").remove();
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if(token && userId){
      const div = document.createElement("div");

      div.className = "d-flex justify-content-center m-5";
      div.id = "loadingOrders";
      div.innerHTML = `
                <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
      `;
      document.getElementById("view-Order-main").appendChild(div);





      



      let status;
      fetch("https://freshkartapi.herokuapp.com/orders" +"?userId="+userId,{
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((result) => {
        if(status===200 || status===201){
          if(result.orders.length>0){
            if(document.getElementById("noOrder")) document.getElementById("noOrder").remove();
            document.getElementById("optionViewOrder").innerHTML = `
            <select class="selectpicker mr-sm-2" id="inlineFormCustomSelectPref">
                <option selected value="view_all">View All</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
                <option value="rejected">Rejected</option>
            </select>
            <button type="button" class="btn btn-primary btn-sm my-bg-blue-dark ms-3" id="viewOrdersBtn" onclick="filterOrders()">Show</button>
      `;
          result.orders.forEach((order) => {
            const d = new Date( order.createdAt );
            const date =  d.toLocaleString();
            let cancelBtn="";
            let cardBodyClass = "my-class-orders-color"
            if(order.status==="delivered" || order.status==="shipped") cardBodyClass +="-final";
            else if(order.status==="confirmed"){
              cardBodyClass +="-confirmed";
              cancelBtn = `<a href="#" class="btn btn-danger btn-sm my-bg-red-warn my-class-float-right" onclick="cancelOrder('${order._id}')">Cancel Order</a>'`
            }
            else if(order.status==="pending"){
              cardBodyClass +="-pending";
              cancelBtn = `<a href="#" class="btn btn-danger btn-sm my-bg-red-warn my-class-float-right" onclick="cancelOrder('${order._id}')">Cancel Order</a>'`
            }
            else {
              cardBodyClass +="-canceled";
            }
            const div = document.createElement("div");
            div.className="col";
            div.innerHTML = `
                <div class="card">
                    <div class="card-header">
                      <span>Order ID: ${order._id}</span>
                      <a href="#" class="btn btn-primary btn-sm my-bg-blue-dark my-class-float-right" onclick="viewOrder('${order._id}')">View Order</a>
                    </div>
                    <div class="card-body ${cardBodyClass}">
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Name: </span>${order.name}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Phone Number: </span>  ${order.mobile}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Address: </span>  ${order.address}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Status: </span>${capitalize(order.status)}</p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Order Value:</span> <span>&#8377;</span>${order.orderValue} </p>
                      <p class="card-text my-0"><span class="my-text-dark-bold-color">Payment Method: </span>${order.paymentMode}</p>
                      
                    </div>
                    <div class="card-footer text-muted">
                      Order Date: ${date}
                      ${cancelBtn}
                    </div>
                </div>
            `;
            document.getElementById("viewOrderRow").appendChild(div);
          })
        }
        else{
          if(document.getElementById("noOrder")) document.getElementById("noOrder").remove();
          const h1 = document.createElement("h1");
        h1.className = "display-6 text-center p-3 m-5";
        h1.id="noOrder"
        h1.innerHTML = "Please Shop To View Orders";
        document.getElementById("view-Order-main").appendChild(h1);
        }
          if(document.getElementById("loadingOrders"))
          document.getElementById("loadingOrders").remove();
        }
        else if(status===500){
          logout();
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
      




    }
    else{
      if(document.getElementById("loadingOrders"))document.getElementById("loadingOrders").remove();
      document.getElementById("optionViewOrder").remove();
      document.getElementById("viewOrderRow").remove();
      const h1 = document.createElement("h1");
        h1.className = "display-6 text-center p-3 m-5";
        h1.innerHTML = "Please Login To View Orders";
        document.getElementById("view-Order-main").appendChild(h1);
    }


};


const searchBtn = () => {
  const value = document.getElementById("seachBox").value;
  if(value.length>0){
    localStorage.setItem("search", value);
    location.replace("./search.html");
  }
}

const searchBtn2 = () => {
  const value = document.getElementById("seachBox2").value;
  if(value.length>0){
    localStorage.setItem("search", value);
    location.replace("./search.html");
  }
}

const loadSearchPage = () => {
  fetch("https://freshkartapi.herokuapp.com/productCategories")
    .then((res) => res.json())
    .then((resData) => {
      let prodCatId = localStorage.getItem("prodCatId");
      if (prodCatId === null) {
        prodCatId = resData.categories[0]._id;
        localStorage.setItem("prodCatId", prodCatId);
      }
      resData.categories.forEach((cat) => {
        if (cat._id == prodCatId) {
          $("#categoryNameTitle").html(cat.category.toUpperCase());
        }
        const a = document.createElement("a");
        a.setAttribute("href", "products.html");
        a.setAttribute("onclick", "setProdCatId('" + cat._id + "')");
        a.className = "list-group-item list-group-item-action";
        a.innerHTML = `
        <div class="d-flex w-100 justify-content-start align-items-center">
          <span class="fa fa-tasks fa-fw mr-3"></span>
          <span class="">${cat.category}</span>
        </div>
      `;
        document.getElementById("sidebarCategories").append(a);
      });
      if(document.getElementById("loadingCategories"))
        document.getElementById("loadingCategories").remove();
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  const search = localStorage.getItem("search");
  if(search){
    $("#searchTitle").html("SEARCH: "+search);
    console.log("fetch");
    fetch(
      "https://freshkartapi.herokuapp.com/products" +
        "?search=" +
        search
    )
      .then((res) => res.json())
      .then((resData) => {
        $("#searchListRow").empty();
        if (resData.products.length <= 0) {
          const h1 = document.createElement("h1");
          h1.className = "display-6 text-center p-3 m-5";
          h1.innerHTML = "No Products Found!!!";
          document.getElementById("productsViewTable").appendChild(h1);
          const image = document.createElement("img");
          image.setAttribute("src", "./resources/images/logos_images/search_not_found.png");
          image.className = "img-fluid mx-auto d-block";
          image.style.width = "50%";
          document.getElementById("productsViewTable").appendChild(image);

          $("#loadingProducts").remove();
        } else {
          resData.products.forEach((prod) => {
            const div = document.createElement("div");
            div.className = "col";
            div.innerHTML = `
          <div class="card">
              <a href="#" data-bs-toggle="modal" data-bs-target="#productModal"><img
                      src="https://freshkartapi.herokuapp.com${prod.imageUrl[0]}" onclick='getProductModalData("${prod._id}")'
                      class="card-img-top zoom" alt="..."></a>
                    <div class="card-body text-center">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">Contents: ${prod.contents}</p>
              <p class="card-text"><span class="text-muted me-4">MRP:
                      <span>&#8377;</span>${prod.mrp}</span><span class="text-dark ms-4">Our Price:
                      <span>&#8377;</span>${prod.ourPrice}</span></p>
          </div>
          <div class="card-body">
              <label class="my-1 mr-2" for="inlineFormCustomSelectPref">QTY:</label>
              <input type="number" class="inline-form-control qty-width ${prod._id}" value="1" min="1" max="4">
          <button type="button" id="addToCartBtn" class="btn btn-primary btn-sm my-bg-blue-dark my-class-float-right" onclick="addToCartbtn('${prod._id}',false)">Add
              to Cart</button>
          </div>
      </div>
          `;
            document.getElementById("searchListRow").appendChild(div);
          });
          document.getElementById("loadingProducts").remove();
        }
        localStorage.removeItem("search");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }
  else{
    $("#searchTitle").html("No Query To Search");
    document.getElementById("loadingProducts").remove();
    console.log("here");
  }
}








