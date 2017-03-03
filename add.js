function providerSelect(select) {
	function getOption(text, value) {
		var option = document.createElement('option');
		option.text = text;
		option.setAttribute("value", value);
		return option;
	}

	select.appendChild(getOption("Please Select Your Wallet Provider", "none"));

	for(provider in App.Providers) {
		select.appendChild(getOption(provider, provider));
	}
};

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("save-button").addEventListener("click", function(e) {
		var elems = document.forms[0].elements;
		var name = elems["name"].value;
		var address = elems["address"].value;
		var provider = elems["provider"].value;

		if(!name) message("Please enter a name for your wallet");
		else if(!address) message("Please provide your wallet address");
		else if(!provider || provider == "none") message("Please choose the provider for your wallet");
		else {
			message("Saving...");
			list = new WalletList(App.KEY_OWNED_WALLETS, function() {
				list.add({
					"name": name,
					"address": address,
					"provider": provider
				});

				list.save(function() {
					message("Saved!");
				});
			});
		}
	});

	document.getElementById("cancel-button").addEventListener("click", function(e) {
		window.location.href="my-wallets.html";
	});

	providerSelect(document.forms[0].elements["provider"]);
});
