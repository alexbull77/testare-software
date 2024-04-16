describe("title", () => {
  it("passes", () => {
    const orgId = "1f4228bd-4a53-4b80-8c92-534d93fe6bfe";
    let accessToken = "";

    // cy.intercept("POST", `http://localhost:3000/auth/login`, (req) => {
    //   req.continue((res) => {
    //     accessToken = res.body.access_token;
    //     console.log(accessToken);
    //   });
    // });

    cy.intercept(
      "GET",
      `http://localhost:3000/dynamic-tables/get-all/${orgId}`,
      (req) => {
        // const { headers } = req;

        // headers["Authorization"] = `Bearer ${accessToken}`;

        req.continue((res) => {
          console.log(res);
        });
      }
    );

    cy.visit("http://localhost:5173/login");
    cy.get('[data-test="username-input"]').type("alex1");
    cy.get('[data-test="password-input"]').type("alex1");
    cy.get('[data-test="login-button"]').click();
  });
});
