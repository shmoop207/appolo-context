"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const Q = require("bluebird");
const index_1 = require("../index");
let should = chai.should();
describe("context", function () {
    it('should call get context', async () => {
        class CustomContext extends index_1.Context {
            getTest() {
                return this.get("test");
            }
        }
        let context = index_1.namespace.create("test", CustomContext);
        context.initialize();
        class Test {
            async handle() {
                return context.scope(async () => {
                    context.set("test", "Test");
                    await Q.delay(1);
                    let test2 = new Test2();
                    let result = await test2.handle();
                    return result;
                });
            }
        }
        class Test2 {
            async handle() {
                await Q.delay(1);
                let context = index_1.namespace.get("test");
                return "Test2" + context.getTest();
            }
        }
        let test = new Test();
        let result = await test.handle();
        result.should.be.eq("Test2Test");
        context.destroy();
    });
    it('should call get context using default', async () => {
        index_1.context.initialize();
        class Test {
            async handle() {
                return index_1.context.scope(async () => {
                    index_1.context.set("test", "Test");
                    await Q.delay(1);
                    let test2 = new Test2();
                    let result = await test2.handle();
                    return result;
                });
            }
        }
        class Test2 {
            async handle() {
                await Q.delay(1);
                return "Test2" + index_1.context.get("test");
            }
        }
        let test = new Test();
        let result = await test.handle();
        result.should.be.eq("Test2Test");
    });
    it('should call get context parallel', async () => {
        let context = index_1.namespace.create("test2");
        context.initialize();
        class Test {
            async handle(id) {
                return context.scope(async () => {
                    context.set("test", id);
                    await Q.delay(1);
                    let test2 = new Test2();
                    let result = await test2.handle();
                    return result;
                });
            }
        }
        class Test2 {
            async handle() {
                await Q.delay(1);
                let context = index_1.namespace.get("test2");
                return "Test2" + context.get("test");
            }
        }
        let test = new Test();
        let [result, result2] = await Q.all([test.handle("1"), test.handle("2")]);
        result.should.be.eq("Test21");
        result2.should.be.eq("Test22");
    });
});
//# sourceMappingURL=unit.js.map