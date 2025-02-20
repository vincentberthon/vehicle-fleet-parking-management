import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { execSync } from "node:child_process";

Given("my fleet", function () {
	const output = execSync("fleet create user123").toString();
	assert(output.includes("Fleet created with id:"), "Fleet creation failed");

	const parts = output.split("Fleet created with id:");
	assert(parts.length > 1, "Fleet ID not found");
	this.fleetId = parts[1].trim();
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

Given("a location {string}", function (location: string) {
	const [lat, lng] = location.split(",");
	assert(lat && lng, "Invalid location format");
	this.location = { lat: lat.trim(), lng: lng.trim() };
});

Given("my vehicle has been parked into this location", function () {
	const result = execSync(
		`fleet localize-vehicle ${this.fleetId} ${this.vehiclePlateNumber} ${this.location.lat} ${this.location.lng}`,
	).toString();
	assert(result.includes("localized"), "Vehicle localization failed");
});

When("I park my vehicle at this location", function () {
	this.result = execSync(
		`fleet localize-vehicle ${this.fleetId} ${this.vehiclePlateNumber} ${this.location.lat} ${this.location.lng}`,
	).toString();
});

When("I try to park my vehicle at this location", function () {
	this.result = execSync(
		`fleet localize-vehicle ${this.fleetId} ${this.vehiclePlateNumber} ${this.location.lat} ${this.location.lng}`,
	).toString();
});

Then(
	"the known location of my vehicle should verify this location",
	function () {
		const checkOutput = execSync(
			`psql -U user -d fleet_management -c "SELECT * FROM vehicle WHERE plate_number = '${this.vehiclePlateNumber}'"`,
		).toString();
		assert(
			checkOutput.includes(this.location.lat) &&
				checkOutput.includes(this.location.lng),
			`Vehicle ${this.vehiclePlateNumber} is not at the expected location`,
		);
	},
);

Then(
	"I should be informed that my vehicle is already parked at this location",
	function () {
		assert(
			this.result.includes("already parked"),
			"Expected an error message about duplicate vehicle localization",
		);
	},
);
