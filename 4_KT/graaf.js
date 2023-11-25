class Graaf {
	constructor() {
		this.tipud = [];
		this.servad = {};
		this.kaugused = {};
	}

	lisaTipp(tipp) {
		this.tipud.push(tipp);
		this.servad[tipp] = {};
	}

	lisaServ(t1, t2, kaal) {
		this.servad[t1][t2] = kaal;
	}

	muudaTippudeKaal(t1, t2, kaal) {
		this.servad[t1][t2] = kaal;
	}

	dijkstra(algus, l6pp, markerid) {
		let vanemTipud = {},
			kylastatud = new Set();
		for (const element of this.tipud) {
			if (element === algus) {
				this.kaugused[algus] = 0;
			} else {
				this.kaugused[element] = Infinity;
			}
			vanemTipud[element] = null;
		}

		let vaadeldavTipp = this.leiaTippMinKaugus(this.kaugused, kylastatud, markerid);

		while (vaadeldavTipp !== null && vaadeldavTipp !== l6pp) {
			let kaugusVaadeldavastTipust = this.kaugused[vaadeldavTipp],
				naaberTipud = this.servad[vaadeldavTipp];
			for (let naaberTipp in naaberTipud) {
				let newDistance = kaugusVaadeldavastTipust + naaberTipud[naaberTipp];
				if (this.kaugused[naaberTipp] > newDistance) {
					this.kaugused[naaberTipp] = newDistance;
					vanemTipud[naaberTipp] = vaadeldavTipp;
				}
			}
			kylastatud.add(vaadeldavTipp);
			vaadeldavTipp = this.leiaTippMinKaugus(this.kaugused, kylastatud, markerid);

			markerid[vaadeldavTipp].setStyle({ color: "red" });
		}

		if (this.kaugused[l6pp] !== Infinity) {
			this.logiLyhimTee(vanemTipud, l6pp, markerid);
			document.getElementById("sisu").innerHTML = "Lühim tee " + algus + " → " + l6pp + " on ca " + Math.round(this.kaugused[l6pp]) + " km pikk.";
		} else {
			document.getElementById("sisu").innerHTML = "Lühim tee puudub :(";
		}
	}

	leiaTippMinKaugus(kaugus, kylastatud) {
		let minKaugus = Infinity,
			minPikkusegaTipp = null;

		for (let tipp in kaugus) {
			let kaugusTipp = kaugus[tipp];
			if (kaugusTipp < minKaugus && !kylastatud.has(tipp)) {
				markerid[tipp].setStyle({ color: "red" });
				minKaugus = kaugusTipp;
				minPikkusegaTipp = tipp;
			}
		}
		return minPikkusegaTipp;
	}

	logiLyhimTee(vanemad, hetkeneTipp, markerid) {
		markerid[hetkeneTipp].setStyle({ color: "yellow" });
		if (vanemad[hetkeneTipp] !== null) {
			document.getElementById("sisu2").innerHTML +=
				vanemad[hetkeneTipp] + " → " + hetkeneTipp + " " + Math.round(this.kaugused[hetkeneTipp] - this.kaugused[vanemad[hetkeneTipp]]) + "km , ";
			this.logiLyhimTee(vanemad, vanemad[hetkeneTipp], markerid);
		}
	}
}
