const save = "session-string";

/* APP */
M.Modal.init(document.querySelector('.modal'), {});
loadVertretung();

function performLogout(){
    $.ajax({
        type: "POST",
        crossDomain: true,
        async:true,
        url: "https://app.cojobo.net/xml/logout.php",
        timeout: 7000,
        data: {
            d_id: 7,
            session: localStorage.getItem(save),
        },
        xhrFields: {
            withCredentials: true
        },
        success: function(result){
            var $res = $(result),
                $root = $res.find("root"),
                logout = $root.find("logout").text();
            logout = (logout == "true");
            if(logout){
                M.toast({html: 'Logout wurde ausdeführt!'});
                localStorage.clear();
                
                $("#error").html('');
                $("#nav-logout").hide();
                $("#vertretungen").html('');
                showLogin();
            }else{
                $("#error").html("<h3>Logout kann zurzeit nicht ausgef&uuml;hrt werden</h3><p>Versuchen Sie es sp&auml;ter erneut.</p>");
            }
        },
        fail: function(){
            $("#error").html("<h3>Logout kann zurzeit nicht ausgef&uuml;hrt werden</h3><p>Versuchen Sie es sp&auml;ter erneut.</p>");
        }
    });
}

function add_logout() {
    $("#nav-logout").click(function() {
       //perform logout
       //return to stundenplan
        performLogout();
    }).show();
}

function remove_logout() {
    

}

function getDeviceName() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

// In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
// In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
// In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
// In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
// In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
// In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
// trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

// This script sets OSName variable as follows:
// "Windows"    for all versions of Windows
// "MacOS"      for all versions of Macintosh OS
// "Linux"      for all versions of Linux
// "UNIX"       for all other UNIX flavors
// "Unknown OS" indicates failure to detect the OS

    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

    return browserName + fullVersion + ' on ' + OSName;
}
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function showLogin() {
    $("#loader").hide();
    $("#login").show();
    $("#menu").show();

    $("#submit-login").click(function () {
        performLogin($('#username').val(), $('#password').val());
    });
}

function performLogin(username, password) {
    $("#login").hide();
    $("#menu").hide();
    $("#loader").show();

    var d_id = 7;
    var d_name = getDeviceName();

    $.ajax({
        type: "POST",
        crossDomain: true,
        async: true,
        url: "https://app.cojobo.net/xml/login.php",
        timeout: 7000,
        data: {
            d_id: d_id,
            d_name: d_name,
            username: username,
            password: password
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var $res = $(result), $root = $res.find("root");
            var login = ($root.find("login").text() === "true");
            var session = $root.find("session").text();
            var errorMsg = $root.find("errorMsg").text();

            if (login) {
                //login successful
                //store session-string in storage
                localStorage.setItem(save, session);
                loadPage();
            } else {
                //show error-message
                $("#loader").hide();
                $("#login").show();
                $("#menu").show();
                $("#error").html("<h4>Login fehlgeschlagen</h4><p>" + errorMsg + "</p>");
            }

        },
        fail: function () {
            $("#menu").show();
            $("#error").html("<h4>Verbindungsproblem mit Server</h4>");
        }
    });

}

function loadPage() {
    function createLiItem(datum, stunde, titel, vertreter, beschreibung, raum) {
        // open tag
        item = '<li class="collection-item avatar" style="padding-left: 30px;padding-right: 90px">';
        //stunde der vertretung
        //item += '<i class="circle  material-icons transparent black-text">'+stunde+'</i>';
        //titel der vertretung
        item += '<span class="title">' + titel + '</span>';
        //vertreter und beschreibung
        item += '<p>';
        if (vertreter != "") {
            item += vertreter + '-'
        }
        item += beschreibung + '</p>';
        //raum der vertretung
        item += '<p class="secondary-content right-align">' + raum + '<br>' + stunde + '. Stunde</p>';
        //close tag
        item += '</li>';
        return item;
    }

    var session = localStorage.getItem(save);

    $.ajax({
        type: "POST",
        crossDomain: true,
        async: true,
        url: "https://app.cojobo.net/xml/hauptdaten.php",
        timeout: 7000,
        data: {
            d_id: 7,
            session: session
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var elements = $(result).find("vertretung");
            item = "<ul class='collection with-header'>";

            VertretungCounter = 0;
            var oldDatum;
            elements.find("item").each(function () {
                datum = $(this).find("datum").text();
                kurs = $(this).find("kurs").text();       //stufe
                fach = $(this).find("fach").text();
                vertreter = $(this).find("vertreter").text();
                raum = $(this).find("raum").text();
                bemerkung = $(this).find("bemerkung").text();
                stunde = $(this).find("stunde").text();

                if (datum.localeCompare(oldDatum)) {
                    item += '<li class="collection-header"><h4>' + datum + '</h4></li>';
                }
                titel = "<span style='color: grey;'>" + kurs + "</span> " + fach;
                item += createLiItem(datum, stunde, titel, vertreter, bemerkung, raum);

                VertretungCounter++;
                oldDatum = datum;
            });
            item += "</ul>";
            if (VertretungCounter > 0) {
                $("#loader").hide();
                $("#vertretungen").html('<h3>Vertretungen</h3>' + item).show();
                $("#menu").show();
                add_logout();
            } else {
                $("#loader").hide();
                $("#menu").show();
                add_logout();
                $("#error").html("keine Vertretungen");
            }
        },
        fail: function () {
            $("#menu").show();
            add_logout();
            $("#error").html("<h4>Verbindungsproblem mit Server</h4>");
        }
    });
}

function loadVertretung() {
    if (storageAvailable('localStorage')) {
        if (!localStorage.getItem(save)) {
            showLogin();
        } else {
            loadPage();
        }
    }
    else {
        // Too bad, no localStorage for us
        if (storageAvailable('sessionStorage')) {
            // Yippee! We can use sessionStorage awesomeness
            //perform everything as a session
            console.log('only sessionStorage available');
        }
        else {
            // Too bad, not even sessionStorage for us
            //throw an error and ask for permission
            console.log('no storage available');
        }
    }
}
