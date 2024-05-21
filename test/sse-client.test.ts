import SSEClient from "../src/index"

/**
 * SSEClient test
 */
describe("SSEClient test", () => {

  it("SSEClient is instantiable", () => {
    expect(new SSEClient()).toBeInstanceOf(SSEClient)
  })
})
