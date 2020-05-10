$(document).ready(function () {
  var host = window.location.origin;
  var username = "";
  var pass = "";
  $("#registration_button").click(function () {
    if ($("#username").val() == '') {
      $("#username").val('');
      $("#username").attr("placeholder", "Please enter the username");
      return;
    }
    if ($("#pass").val() == '') {
      $("#pass").val('');
      $("#pass").attr("placeholder", "Please enter password");
      return;
    }
    username = $("#username").val();
    password = $("#pass").val();
    email = $("#email").val();
    $.post(host + "/add_user", {
      username,
      password,
      email
    },
      function (registrationInfo) {
        if (registrationInfo.status == 'success') {
          alert(registrationInfo.details);
          return;
        }
        else {
          alert(registrationInfo.details);
          return;
        }
      });

  });
  login_button
  $("#login_button").click(function () {
    if ($("#email").val() == '') {
      $("#email").val('');
      $("#email").attr("placeholder", "Please enter the email");
      return;
    }
    if ($("#pass").val() == '') {
      $("#pass").val('');
      $("#pass").attr("placeholder", "Please enter password");
      return;
    }
    email = $("#email").val();
    password = $("#pass").val();
    $.post(host + "/login", {
      password,
      email
    }, function (registrationInfo) {
      if (registrationInfo.status == 'success') {
        alert(registrationInfo.details);
        return;
      }
      else {
        alert(registrationInfo.details);
        return;
      }
    });

  });
  // validate name
  $("#username").change(function () {
    username = $("#username").val();
    var letters = /^[A-Za-z]+$/;
    if (username.match(letters)) {
      return true;
    }
    else {
      alert("Allow only characters!!!");
      return false;
    }
  });
});