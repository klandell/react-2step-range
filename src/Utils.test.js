const Utils = require("./Utils")
// @ponicode
describe("Utils.findChildrenByType", () => {
    test("0", () => {
        let param1 = [["Pierre Edouard", "Pierre Edouard", "Jean-Philippe"], ["Anas", "Pierre Edouard", "Edmond"], ["Anas", "Pierre Edouard", "Edmond"]]
        let callFunction = () => {
            Utils.findChildrenByType(param1, "array")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1 = [["George", "Edmond", "Edmond"], ["Edmond", "Jean-Philippe", "Pierre Edouard"], ["George", "Edmond", "Jean-Philippe"]]
        let callFunction = () => {
            Utils.findChildrenByType(param1, "array")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1 = [["Edmond", "Edmond", "Edmond"], ["Edmond", "George", "Pierre Edouard"], ["Michael", "George", "George"]]
        let callFunction = () => {
            Utils.findChildrenByType(param1, "number")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1 = [["Jean-Philippe", "Michael", "Edmond"], ["Jean-Philippe", "Jean-Philippe", "Jean-Philippe"], ["Edmond", "Pierre Edouard", "Michael"]]
        let callFunction = () => {
            Utils.findChildrenByType(param1, "array")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1 = [["Pierre Edouard", "George", "Michael"], ["Jean-Philippe", "Anas", "Michael"], ["Michael", "George", "Anas"]]
        let callFunction = () => {
            Utils.findChildrenByType(param1, "number")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            Utils.findChildrenByType(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("Utils.findChildByType", () => {
    test("0", () => {
        let callFunction = () => {
            Utils.findChildByType(["Edmond", "Anas", "George"], "string")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            Utils.findChildByType(["Michael", "George", "George"], "object")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            Utils.findChildByType(["Michael", "George", "George"], "number")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            Utils.findChildByType(["Edmond", "Pierre Edouard", "Anas"], "array")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            Utils.findChildByType(["Edmond", "Jean-Philippe", "George"], "object")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            Utils.findChildByType(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("Utils.renderChildOfType", () => {
    test("0", () => {
        let param2 = [[true, true, false], [true, true, true], [false, false, false]]
        let callFunction = () => {
            Utils.renderChildOfType("array", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param2 = [[true, false, false], [true, false, true], [true, true, false]]
        let callFunction = () => {
            Utils.renderChildOfType("array", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param2 = [[false, false, false], [false, false, true], [true, false, true]]
        let callFunction = () => {
            Utils.renderChildOfType("string", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param2 = [[true, true, true], [false, false, false], [true, true, false]]
        let callFunction = () => {
            Utils.renderChildOfType("string", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param2 = [[true, false, true], [true, false, false], [true, false, true]]
        let callFunction = () => {
            Utils.renderChildOfType("number", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            Utils.renderChildOfType(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("Utils.capitalize", () => {
    test("0", () => {
        let callFunction = () => {
            Utils.capitalize("<?xml version=\"1.0\" ?><a b=\"c\"/>")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            Utils.capitalize(" ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            Utils.capitalize("<?xml version=\"1.0\" ?>\n<a b=\"c\"/>\n")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            Utils.capitalize(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("Utils.findClosestIdx", () => {
    test("0", () => {
        let callFunction = () => {
            Utils.findClosestIdx([-1, -10, 10], 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            Utils.findClosestIdx([-1, 0, -10], -10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            Utils.findClosestIdx([-10, -1, 1], "Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            Utils.findClosestIdx([1, 0.0, 1], "elio@example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            Utils.findClosestIdx(["Anas", 1, "Edmond"], "Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            Utils.findClosestIdx(undefined, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
