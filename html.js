const params = new URLSearchParams(window.location.search);

const orderCode = params.get("code");

demo = document.getElementById("status").innerHTML = orderCode;

console.log(orderCode);
