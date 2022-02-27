const sb = require("@supabase/supabase-js");

const supabase = sb.createClient(
	process.env['supabase_url'], process.env['supabase_key']
);

exports.queryAddress = async function (UID) {
    let userAddress = {};
	let isUserPresent = false;
	let rawAddrData = await supabase
		.from('addresses')
		.select()

	let addrData = rawAddrData.data;

	// check if address exists

	for (let i = 0; i<addrData.length; i++) {
		if (addrData[i]['uid'] == UID) {
			console.log(addrData[i]);
			isUserPresent = true;
			userAddress = addrData[i];
			break
		}
	}

	if (isUserPresent == false) {
		const { addingData, addingError } = await supabase
			.from('addresses')
			.insert([
				{ uid: UID, name: "", addr1: "", addr2: "", city: "", state: "", zip: "", country: "" }
			])
		console.log(addingData);
	}

    return userAddress;
}

exports.queryPackage = async function (packageID) {
	let rawPkgData = await supabase
		.from('packages')
		.select()

	let pkgInfo;

	let pkgData = rawPkgData.data;

	for (let i = 0; i<pkgData.length; i++) {
		if (pkgData[i]['name'] == packageID) {
			console.log(pkgData[i]);
			pkgInfo = pkgData[i];
			break
		}
	}

    return pkgInfo;
}

exports.queryOrdersByUID = async function (UID) {
	let rawOrders = await supabase
		.from('orders')
		.select()

	let orderList = [];

	let orderData = rawOrders.data;

    console.log(orderData, "HDIHIDSHIFHI");

	for (let i = 0; i<orderData.length; i++) {
		if (orderData[i]['toUID'] == UID) {
			console.log(orderData[i]);
			orderList.push(orderData[i].ts);
		}
	}

    return orderList;
}

exports.queryOrderInfoByTS = async function (ts) {
	let rawOrders = await supabase
		.from('orders')
		.select()

	let order;

	let orderData = rawOrders.data;

    console.log(orderData);

	for (let i = 0; i<orderData.length; i++) {
		console.log(orderData[i]['ts'], ts)
		if (orderData[i]['ts'] == ts) {
			order = orderData[i]
		}
	}

    return order;
}

exports.queryUIDbyTS = async function (ts) {
	let rawOrderData = await supabase
		.from('orders')
		.select()

	let orderData = rawOrderData.data;
	let recipientUID;

	for (let i = 0; i<orderData.length; i++) {
		if (orderData[i]['ts'] == ts) {
			recipientUID = orderData[i].toUID;
			break
		}
	}

	return recipientUID

}

exports.queryNodemaster = async function (UID) {
	let rawNodeData = await supabase
		.from('nodemasters')
		.select()

	nodeData = rawNodeData.data;

	let isNodemaster = false;

	for (let i = 0; i<nodeData.length; i++) {
		if (nodeData[i]['uid'] == UID) {
			isNodemaster = true;
			break
		}
	}

    return isNodemaster;
}

exports.addOrder = async function (ts, fromUID, toUID, packageName) {
	const { data, error } = await supabase
		.from('orders')
		.insert([
			{ ts: ts, fromUID: fromUID, toUID: toUID, packageName: packageName }
	])

	return
}

exports.updateAddress = async function (UID, name, addr1, addr2, city, state, zip, country) {
	const { data, error } = await supabase
		.from('addresses')
		.update({ name: name, addr1: addr1, addr2: addr2, city: city, state: state, zip: zip, country: country })
		.match({ uid: UID })
}
