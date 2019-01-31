"use strict";
import chai = require('chai');
import Q = require('bluebird');
import {Context, namespace,context} from "../index";

let should = chai.should();

describe("context", function () {


    it('should call get context', async () => {

        class CustomContext extends Context {

            getTest(): string {
                return this.get("test")
            }
        }

        let context = namespace.create("test",()=>new CustomContext());
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

                let context = namespace.get("test") as CustomContext;

                return "Test2" + context.getTest()
            }
        }

        let test = new Test();


        let result = await test.handle();


        result.should.be.eq("Test2Test");

        context.destroy();

    });

    it('should call get context using default', async () => {


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

                return "Test2" + context.get("test")
            }
        }

        let test = new Test();


        let result = await test.handle();


        result.should.be.eq("Test2Test");

    });


    it('should call get context parallel', async () => {

        let context = namespace.create("test2");

        context.initialize();


        class Test {


            async handle(id: string) {

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

                let context = namespace.get("test2");

                return "Test2" + context.get("test")
            }
        }

        let test = new Test();


        let [result, result2] = await Q.all([test.handle("1"), test.handle("2")]);


        result.should.be.eq("Test21");
        result2.should.be.eq("Test22");


    });


});