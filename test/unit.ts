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


            async handle(id: string,num:number) {

                return context.scope(async () => {
                    context.set("test", id);

                    await Q.delay(num);

                    let test2 = new Test2();

                    let result = await test2.handle(num);

                    return result;
                });
            }
        }

        class Test2 {


            async handle(num:number) {

                await Q.delay(num);

                let context = namespace.get("test2");

                await Q.delay(num);

                return "Test2" + context.get("test")
            }
        }

        let test = new Test();


        let [result, result2,result3] = await Q.all([test.handle("1",3), test.handle("2",1),test.handle("3",2)]);


        result.should.be.eq("Test21");
        result2.should.be.eq("Test22");
        result3.should.be.eq("Test23");


    });


});
