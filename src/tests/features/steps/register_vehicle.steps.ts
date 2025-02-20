import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { execSync } from "node:child_process";

Given("my fleet", function () {
	const output = execSync("fleet create user123").toString();
	assert(output.includes("Fleet created with id:"), "Fleet creation failed");

	const parts = output.split("Fleet created with id:");
	assert(parts.length > 1, "Fleet id not found");
	this.fleetId = parts[1].trim();
});

Given("the fleet of another user", function () {
	const output = execSync("fleet create user456").toString();
	assert(output.includes("Fleet created with id:"), "Fleet creation failed");

	const parts = output.split("Fleet created with id:");
	assert(parts.length > 1, "Fleet ID not found");
	this.anotherFleetId = parts[1].trim();
});

Given("a vehicle with plate number {string}", function (plateNumber: string) {
	this.vehiclePlateNumber = plateNumber;
});

Given("I have registered this vehicle into my fleet", function () {
	const result = execSync(
		`fleet register-vehicle ${this.fleetId} ${this.vehiclePlateNumber}`,
	).toString();
	assert(result.includes("added"), "Vehicle registration failed");
});

Given("this vehicle has been registered into the other user's fleet", function () {
	execSync(
		`fleet register-vehicle ${this.anotherFleetId} ${this.vehiclePlateNumber}`,
	);
});

When("I register this vehicle into my fleet", function () {
	this.result = execSync(
		`fleet register-vehicle ${this.fleetId} ${this.vehiclePlateNumber}`,
	).toString();
});

When("I try to register this vehicle into my fleet", function () {
	this.result = execSync(
		`fleet register-vehicle ${this.fleetId} ${this.vehiclePlateNumber}`,
	).toString();
});

Then("this vehicle should be part of my vehicle fleet", function () {
	const checkOutput = execSync(
		`psql -U user -d fleet_management -c "SELECT * FROM vehicle WHERE plate_number = '${this.vehiclePlateNumber}'"`,
	).toString();
	assert(
		checkOutput.includes(this.vehiclePlateNumber),
		`Vehicle ${this.vehiclePlateNumber} not found in database`,
	);
});

Then(
	"I should be informed that this vehicle has already been registered into my fleet",
	function () {
		assert(
			this.result.includes("already been registered"),
			"Expected an error message about duplicate vehicle registration",
		);
	},
);
