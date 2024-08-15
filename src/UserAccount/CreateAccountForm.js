import $ from "jquery";
import { useNavigate } from "react-router-dom";
import RouteNav from "../components/RouteNav";
import localStringify from "../utils/localStringify";
import { useAuth } from "./AuthContext";

function CreateAccountForm() {
  const navigate = useNavigate();

  const { relogin } = useAuth();

  const userData = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };

  function handleSubmitCreateAccount(e) {
    e.preventDefault();
    $.ajax({
      url: `http://localhost:8080/api/user/create`,
      method: "POST",
      data: JSON.stringify(userData),
      contentType: "application/json",
      success: (res) => {
        console.log(res);
        relogin(res);
        navigate(`/app/questionnaire/${res.userId}`);
      },
      error: (err) => {
        const resp = err.responseText;
        if (resp) {
          console.log("showing error");
          const creationErrMsg = document.getElementById("creation-err-msg");
          creationErrMsg.textContent = resp;
          creationErrMsg.style.display = "inline";
        }
        console.log(err);
      },
    });
  }

  function handleInputChanged(field) {
    return (e) => {
      if (field === "password") {
        userData[field] = e.target.value;
        validateConfirmPassword(
          document.getElementById("confirmPassword").value
        );
      } else {
        userData[field] = e.target.value;
      }
    };
  }

  function validateConfirmPassword(s) {
    const errMsg = document.getElementById("err-msg");
    if (s !== userData["password"]) {
      errMsg.style.display = "block";
      errMsg.textContent = "Password mismatched";
    } else {
      errMsg.style.display = "none";
    }
    if (
      s.length < 8 ||
      !includeUppercaseLetter(s) ||
      !includeLowercaseLetter(s) ||
      !includeNumericChar(s)
    ) {
      errMsg.style.display = "block";
      errMsg.textContent =
        "At least 1 uppercase letter, 1 lowercase letter and at least 8 characters required.";
    } else {
      errMsg.style.display = "none";
    }
  }

  function includeUppercaseLetter(s) {
    const uppercaseletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var c of s) {
      if (uppercaseletters.includes(c)) {
        return true;
      }
    }
    return false;
  }

  function includeLowercaseLetter(s) {
    const lowercaseletters = "abcdefghijklmnopqrstuvwxyz";
    for (var c of s) {
      if (lowercaseletters.includes(c)) {
        return true;
      }
    }
    return false;
  }

  function includeNumericChar(s) {
    const numericChar = "0123456789";
    for (var c of s) {
      if (numericChar.includes(c)) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <RouteNav />

      <div className="container w-100 mt-4">
        <form onSubmit={handleSubmitCreateAccount} className="form m-auto w-50">
          <h4>Create New Account</h4>
          <div className="form-group">
            <label className="my-2 ">
              Username:{" "}
              <span
                style={{ display: "none", color: "red" }}
                id="creation-err-msg"
              ></span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              onChange={handleInputChanged("username")}
              required
            />
          </div>

          <div className="form-group">
            <label className="my-2">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              onChange={handleInputChanged("email")}
            />
          </div>
          <div className="form-group">
            <label className="my-2">First name:</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="form-control"
              onChange={handleInputChanged("firstName")}
            />
          </div>
          <div className="form-group">
            <label className="my-2">Last name:</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="form-control"
              onChange={handleInputChanged("lastName")}
            />
          </div>
          <div className="form-group">
            <label className="my-2">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              onChange={handleInputChanged("password")}
              required
            />
          </div>
          <div className="form-group">
            <label className="my-2">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"
              onChange={(e) => validateConfirmPassword(e.target.value)}
              required
            />
            <span style={{ display: "none", color: "red" }} id="err-msg"></span>
          </div>
          <input
            type="submit"
            value="Create"
            className="my-3 btn bg-primary text-white"
          />
        </form>
      </div>
    </>
  );
}

export default CreateAccountForm;
