var OperatorPressed = false;
var previousOpperator = "";
$(function () {
  $("[number]").on("click touchstart", function (e) {
    e.preventDefault(); //touch be like run more than once.

    //check if we have an operator pressed so we can start filling in the second number.
    if (OperatorPressed) {
      if (CheckValidNumberInput($("[secondnumber]").text(), $(this).attr("number"))) {
        $("[secondnumber]").removeClass("none").append($(this).attr("number"));
      }
    } else {
      if (CheckValidNumberInput($("[firstnumber]").text(), $(this).attr("number"))) {
        $("[firstnumber]").append($(this).attr("number"));
      }
    }
  });

  //Opperation buttons logic.
  $("[operation]").on("click touchstart", function (e) {
    e.preventDefault(); //touch be like run more than once.

    //unselect all the other buttons before pressing the new one.
    $("[operation]").each(function () {
      $(this).removeClass("toggle");
    });

    //if the clear awnser is selected we want to reset everthing.
    if ($(this).attr("operation") == "clearAwnser") {
      OperatorPressed = false;
      $("[secondnumber]").addClass("none").append("");
      $("[Operator]").addClass("none").text("");
      $("[firstnumber]").text("");
      $(".history-body").html("");
      console.info("Clear Awnser pressed, resetting everything");
      return;
    }

    if ($(this).attr("operation") == "clear") {
      //if we have an operator clear both the operator and second number input.
      if (OperatorPressed) {
        OperatorPressed = false;
        $("[secondnumber]").addClass("none").text("");
        previousOpperator = "";
        $("[Operator]").addClass("none").text("");
        return;
      }

      //otherwise we want to clear the first awnser as there is no second number or operator pressed.
      $("[firstnumber]").text("");
    }

    //only allow an operator when the first number is valid.
    if (isNaN($("[firstnumber]").text()) || $("[firstnumber]").text() == "") {
      console.error("Unable to press an operator as the first number is not filled in.");
      return;
    }

    //check if we can calculate the awnser.
    if ($(this).attr("operation") == "=") {
      if (!CheckValidNumberInput($("[firstnumber]").text(), "", "=") || !CheckValidNumberInput($("[secondnumber]").text(), "", "=") || !OperatorPressed) {
        console.error("Equals Pressed but one or more numbers are invalid");
        return;
      }

      //we can calculate the awnser.
      var Awnser;
      var ParsedFirstNumber = parseFloat($("[firstnumber]").text());
      var ParsedSecondNumber = parseFloat($("[secondnumber]").text());
      switch ($("[Operator]").text()) {
        case "/":
          Awnser = ParsedFirstNumber / ParsedSecondNumber;
          break;
        case "x":
          Awnser = ParsedFirstNumber * ParsedSecondNumber;
          break;
        case "-":
          Awnser = ParsedFirstNumber - ParsedSecondNumber;
          break;
        case "+":
          Awnser = ParsedFirstNumber + ParsedSecondNumber;
          break;
        default:
      }

      //check the awnser for ISNAN for most common errors like devide by 0 errors etc.
      if (isNaN(Awnser)) {
        Awnser = "ERROR";
      }
      // add everything to the history
      var divToAdd = '<div class="history-item"><span class="first">' + $("[firstnumber]").text() + '</span><span class="operator">' + " " + $("[Operator]").text() + " " + '</span><span class="second">' + $("[secondnumber]").text() + '</span> = <span class="awnser">' + Awnser + "</span><div>";
      $(".history-body").append(divToAdd);
      //now hide the fields and add it to the first number so we can continue doing caluclations.
      OperatorPressed = false;
      $("[secondnumber]").addClass("none").text("");
      previousOpperator = "";
      $("[Operator]").addClass("none").text("");
      $("[firstnumber]").text(Awnser);
      return;
    }

    //if the operator is the same we want to hide it.
    //we also want to keep track of it so we know when to detoggle it.
    if (previousOpperator == $(this).attr("operation")) {
      OperatorPressed = false;
      $("[Operator]").addClass("none").text("");
      previousOpperator = "";
    } else {
      $("[Operator]").removeClass("none").text($(this).attr("operation"));
      $(this).addClass("toggle");
      OperatorPressed = true;
      previousOpperator = $(this).attr("operation");
    }
  });

  //show / hide history
  $("[history]").on("click touchstart", function (e) {
    e.preventDefault();

    if ($(this).hasClass("toggle")) {
      $(this).removeClass("toggle");
      $(".body-of-history").addClass("none");
      $(this).text("Show History");
    } else {
      $(this).addClass("toggle");
      $(".body-of-history").removeClass("none");
      $(this).text("Hide History");
    }
  });
});

function CheckValidNumberInput(currentValue, CurrentNumber, Operator = null) {
  //dont allow double decimals.
  if (currentValue.includes(".") && CurrentNumber == ".") {
    console.info("Trying to add a second decmial point. That is not that smart now is it?");
    return false;
  }

  if (currentValue + CurrentNumber == "") {
    console.info("Why are you trying to add an empty string to and empty string?");
    return false;
  }

  //dont allow more then 30 numbers seems accessive.
  if (Operator == null) {
    if (currentValue.length == 30) {
      console.info("Trying to add more than 30 numbers. for UI purpuse this is my limit");
      return false;
    }
  }
  return true;
}
