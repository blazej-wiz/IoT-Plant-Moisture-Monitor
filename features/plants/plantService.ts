fetch("http://192.168.0.90:8000/api/plants")

.then(response => response.json())

.then(res => console.log(res))