const { generateFacultyId } = require("./../functions/uniqueId");

describe("Functions test suite", () => {
  it("Generate faculty id given joining year and internal id", () => {
    expect(generateFacultyId(2014, "084")).toBe("EMP084/14");
  });
});
