function parse() {
        request = new XMLHttpRequest();

        request.open("GET", "https://messagehub.herokuapp.com/messages.json", true);

        /* Creates function to parse the JSON for display */
        request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                        data = JSON.parse(request.responseText);
                        newOutput = "";

                        for (i = 0; i < data.length; i++) {
                                newOutput += "<p>" + data[i]["content"] + " " + data[i]["username"] + "</p>";
                        }

                        document.getElementById("messages").innerHTML = newOutput;
                }
        };

        request.send();
}
