define(['helpers/configuration'],
    function (configuration) {

        function getKey(key) {
            var base = configuration.storage.key || null;
            return base != null ? base + '.' + key : key;
        }

        function getData(name, initial) {
            var data = localStorage.getItem(getKey(name));
            return data == null ? initial : JSON.parse(data);
        }

        function setData(name, data) {
            localStorage.setItem(getKey(name), JSON.stringify(data));
        }

        function getUserData(id, name, initial) {
            return getData(id + '.' + name, initial);
        }

        function setUserData(id, name, data) {
            return setData(id + '.' + name, data);
        }

        var storagecontext = {
            getData: getData,
            setData: setData,
            getUserData: getUserData,
            setUserData: setUserData
        };

        return storagecontext;
    }
);