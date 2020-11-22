module.exports = {

    //Cheatsheet das Options
    /* options = {
        length: 255,
        required: true,
        type: "string",
        range: { min: 1, max: 2 }
    }*/

    validateInput(input, options) {

        if (options.required === true && input) {
            switch (options.type) {
                case "string":
                    if (typeof input === "string") {
                        if (input.length <= options.length) {
                            return input;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                    break;
                case "number":
                    if (typeof input === "number") {
                        if (options.range) {
                            if (input > options.range.max || input < options.range.min) {
                                return null;
                            } else {
                                return input;
                            }
                        } else {
                            return input;
                        }
                    } else {
                        return null;
                    }
                    break;
                case "bool":
                    if (typeof input === "bool") {
                        return input;
                    } else {
                        return null;
                    }
                    break;
                case "date":
                    //2014-02-04
                    if (typeof input === "string") {
                        let regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
                        if (input.match(regex)) {
                            return input;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                    break;
                case "time":
                    //12:34
                    if (typeof input === "string") {
                        let regex = /(2[0-3]|[01][0-9]):[0-5][0-9]/;
                        if (input.match(regex)) {
                            return input;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                    break;
                case "datetime":
                    //2014-02-04 12:34
                    if (typeof input === "string") {
                        let regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
                        if (input.match(regex)) {
                            return input;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                    break;
            }
        } else if (options.required === true && !input) {
            return null;
        } else
            return input
    }

};