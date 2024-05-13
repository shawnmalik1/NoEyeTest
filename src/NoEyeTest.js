/**
 * NoEyeTest: BBGM Prog Script | v.3.2.0
 * See README for documentation & How-To instructions
 */

class NotificationManager {
	static async sendProgNotification(data) {
		const { player, progRange, ageRange, per, godProg, ovr } = data;
		const SZN = bbgm.g.get('season');
		const seasonYr = SZN - 1;
		const { pid, firstName, lastName, tid } = player;
		const notiTitle = godProg
			? 'God Progged!<br/>Prog Info:'
			: 'Prog Info:';
		const ageRangeFull = ageRange || `N/A`;
		const perFull = per ? per.toFixed(2) : `N/A`;
		await bbgm.idb.cache.players.put(player);
		await bbgm.logEvent({
			type: 'Progs',
			text: `<a href="${bbgm.helpers.leagueUrl([
				'player',
				pid,
			])}">${firstName} ${lastName} ${notiTitle}</a><br/><b>Range:</b> ${JSON.stringify(
				progRange,
			)}<br/><b>PER:</b> ${perFull}<br/><b>Age Group:</b> ${ageRangeFull}<br/>OVR: ${ovr}<br/><b>${seasonYr}</b>`,
			showNotification: true,
			pids: [pid],
			tids: [tid],
			persistent: false,
			score: 20,
		});
	}
}

class ProgRangeCalculator {
	static getProgRange(per, options) {
		const { min1, min2, max1, max2, hardMin, hardMax, ovr, age } = options;
		let min = Math.ceil(per / min1) - min2;
		let max = Math.ceil(per / max1) - max2 || 2;

		if (age < 31) {
			min = Math.ceil(per / 5) - 6;
			max = Math.ceil(per / 4) - 1;
		}

		if (hardMin !== undefined) {
			min = Math.max(min, hardMin);
		}
		if (hardMax !== undefined && max > hardMax) {
			max = hardMax;
		}

		const ovrProgression = max + ovr;
		if (ovrProgression >= 80) {
			max = 80 - ovr;
			if (ovr >= 80 || age >= 35) {
				min = -14;
			} else if (age > 30 && age < 35) {
				min = -10;
			} else if (age <= 30 && Math.random() < 0.02) {
				min = -2;
			}
			min = Math.max(min, 0);
		}
		return [min, max];
	}
}

class PlayerProgressionManager {
	static async compileProgs() {
		const players = await bbgm.idb.cache.players.getAll();
		const seasonYr = bbgm.g.get('season') - 1;
		let godProgCount = 0;
		for (const player of players) {
			if (player.watch === 1 && player.draft.year !== seasonYr) {
				const results = await this.processPlayerProgs(player);
				if (results?.godProgged) {
					godProgCount += 1;
				}
			}
		}
		return { godProgCount };
	}

	static async processPlayerProgs(player) {
		let godProgged = false;
		const seasonYr = bbgm.g.get('season') - 1;
		const playerStats = player.stats.filter(
			(stat) =>
				stat.season === seasonYr && stat.per !== 0 && !stat.playoffs,
		);
		const per =
			playerStats.reduce((sum, stat) => sum + stat.per, 0) /
			playerStats.length;
		const age = bbgm.g.get('season') - player.born.year;
		const ageRange = this.getAgeRange(age);
		const ovr = player.ratings.at(-1).ovr;
		const progOptions = {
			min1: 5,
			min2: 2,
			max1: 4,
			max2: 1,
			hardMax: ageRange === '35+' ? 0 : 5,
			ovr,
			age,
		};
		const progRange = ProgRangeCalculator.getProgRange(per, progOptions);
		await NotificationManager.sendProgNotification({
			player,
			progRange,
			ageRange,
			per,
			ovr,
		});

		if (this.shouldGodProg(age, ovr)) {
			await this.handleGodProg(player, progRange, ageRange, per, ovr);
			godProgged = true;
		}

		this.updatePlayerRating(player, progRange);
		await this.finalizePlayerDevelopment(player);
		return { godProgged };
	}

	static shouldGodProg(age, ovr) {
		const MIN_RATING = 30;
		const MAX_RATING = 61;
		const MAX_CHANCE = 0.09;
		const scalingFactor =
			ovr < MIN_RATING
				? 1.0
				: ovr > MAX_RATING
				? 0.01
				: 1.0 - (ovr - MIN_RATING) / (MAX_RATING - MIN_RATING);
		const godProgChance = scalingFactor * MAX_CHANCE;
		return Math.random() < godProgChance;
	}

	static async handleGodProg(player, progRange, ageRange, per, ovr) {
		const minGodProg = 7;
		const maxGodProg = 13;
		const godProgRange = [minGodProg, maxGodProg];
		await NotificationManager.sendProgNotification({
			player,
			progRange: godProgRange,
			ageRange,
			per,
			ovr,
			godProg: true,
		});
		godProgCount++;
	}

	static updatePlayerRating(player, progRange) {
		const ratings = player.ratings.at(-1);
		const keys = [
			'diq',
			'dnk',
			'drb',
			'endu',
			'fg',
			'ft',
			'ins',
			'jmp',
			'oiq',
			'pss',
			'reb',
			'spd',
			'stre',
			'tp',
		];
		keys.forEach((key) => {
			const prog = bbgm.random.randInt(...progRange);
			ratings[key] = bbgm.player.limitRating(ratings[key] + prog);
		});
	}

	static async finalizePlayerDevelopment(player) {
		await bbgm.player.develop(player, 0);
		await bbgm.player.updateValues(player);
		await bbgm.idb.cache.players.put(player);
	}

	static getAgeRange(age) {
		if (age >= 25 && age <= 30) {
			return '25-30';
		} else if (age >= 31 && age <= 34) {
			return '31-34';
		} else {
			return '35+';
		}
	}
}

async function main() {
	const progResults = await PlayerProgressionManager.compileProgs();
	await logGodProgs(progResults?.godProgCount);
}
const logGodProgs = async (godProgCount) => {
	await bbgm.logEvent({
		type: `God Progs`,
		text: `God Prog Count This Run: ${godProgCount}`,
		showNotification: true,
		persistent: false,
		score: 20,
		pids: [0],
	});
};
main();
