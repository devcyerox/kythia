/**
 * @namespace: addons/streak/helpers/index.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

async function getOrCreateStreak(container, userId, guildId) {
	const { Streak } = container.models;
	let userStreak = await Streak.getCache({ userId: userId, guildId: guildId });
	if (!userStreak) {
		userStreak = await Streak.create({
			userId,
			guildId,
			currentStreak: 0,
			highestStreak: 0,
			lastClaimTimestamp: null,
			streakFreezes: 0,
		});
	}
	return userStreak;
}

async function updateNickname(
	member,
	streakCount,
	streakEmoji = '🔥',
	streakMinimum = 3,
) {
	let fetchedMember = member;
	try {
		fetchedMember = await member.guild.members.fetch(member.id);
	} catch (_e) {}

	if (!fetchedMember.manageable) {
		console.log(`Bot cant change nickname: ${fetchedMember.user.username}`);
		return;
	}
	try {
		let currentNickname = fetchedMember.displayName;

		const escapedEmoji = streakEmoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const streakRegex = new RegExp(`\\s${escapedEmoji}\\s\\d+$`);
		currentNickname = currentNickname.replace(streakRegex, '').trim();

		let newNickname = currentNickname;
		if (streakCount >= streakMinimum) {
			newNickname = `${currentNickname} ${streakEmoji} ${streakCount}`;
		}
		if (newNickname.length > 32) {
			newNickname = newNickname.substring(0, 32);
		}
		if (fetchedMember.displayName !== newNickname) {
			await fetchedMember.setNickname(newNickname);
		}
	} catch (error) {
		console.error(
			`Failed to update ${fetchedMember.user.username} username:`,
			error,
		);
	}
}

function getTodayDateString() {
	return new Date().toISOString().slice(0, 10);
}

function getYesterdayDateString() {
	const yesterday = new Date();
	yesterday.setUTCDate(yesterday.getUTCDate() - 1);
	return yesterday.toISOString().slice(0, 10);
}

async function syncStreakRoles(member, streakCount, streakRoleRewards) {
	if (!Array.isArray(streakRoleRewards) || streakRoleRewards.length === 0)
		return [];

	let fetchedMember;
	try {
		fetchedMember = await member.guild.members.fetch(member.id);
	} catch (error) {
		console.error(`Failed to fetch member ${member.id}:`, error);
		return [];
	}

	if (!fetchedMember.manageable) return [];

	const allRewardRoles = [...new Set(streakRoleRewards.map((r) => r.role))];

	const rolesToHave = [
		...new Set(
			streakRoleRewards
				.filter((r) => streakCount >= r.streak)
				.map((r) => r.role),
		),
	];

	const rolesToRemove = allRewardRoles.filter(
		(roleId) => !rolesToHave.includes(roleId),
	);

	const currentRoles = fetchedMember.roles.cache;
	const toAdd = rolesToHave.filter((roleId) => !currentRoles.has(roleId));
	const toRemove = rolesToRemove.filter((roleId) => currentRoles.has(roleId));

	const rolesGiven = [];

	if (toAdd.length > 0) {
		try {
			await fetchedMember.roles.add(
				toAdd,
				`Streak reward: reached ${streakCount} days`,
			);
			rolesGiven.push(...toAdd);
		} catch (error) {
			console.error(`Failed to add roles to ${member.id}:`, error);
		}
	}

	if (toRemove.length > 0) {
		try {
			await fetchedMember.roles.remove(
				toRemove,
				`Streak loss/reset: current streak ${streakCount} days`,
			);
		} catch (error) {
			console.error(`Failed to remove roles from ${member.id}:`, error);
		}
	}

	return rolesGiven;
}

async function claimStreak(container, member, settings) {
	const userId = member.id;
	const guildId = member.guild.id;
	const streak = await getOrCreateStreak(container, userId, guildId);
	const today = getTodayDateString();
	const yesterday = getYesterdayDateString();

	const lastClaimDateStr = streak.lastClaimTimestamp
		? streak.lastClaimTimestamp.toISOString().slice(0, 10)
		: null;

	if (lastClaimDateStr === today) {
		return { status: 'ALREADY_CLAIMED', streak };
	}

	let status = 'CONTINUE';
	if (lastClaimDateStr !== yesterday && streak.currentStreak > 0) {
		if (streak.streakFreezes > 0) {
			streak.streakFreezes -= 1;
			streak.currentStreak += 1;
			status = 'FREEZE_USED';
		} else {
			streak.currentStreak = 1;
			status = 'RESET';
		}
	} else if (lastClaimDateStr === yesterday) {
		streak.currentStreak += 1;
		status = 'CONTINUE';
	} else {
		streak.currentStreak = 1;
		status = 'NEW';
	}

	if (streak.currentStreak > (streak.highestStreak || 0)) {
		streak.highestStreak = streak.currentStreak;
	}

	streak.lastClaimTimestamp = new Date(today);
	await streak.saveAndUpdateCache(['userId', 'guildId']);

	const streakEmoji = settings.streakEmoji || '🔥';
	const streakMinimum = settings.streakMinimum || 3;
	const updateStreakNickname = settings.streakNickname || false;

	if (updateStreakNickname) {
		await updateNickname(
			member,
			streak.currentStreak,
			streakEmoji,
			streakMinimum,
		);
	}

	const rewards = Array.isArray(settings.streakRoleRewards)
		? settings.streakRoleRewards
		: [];
	let rewardRolesGiven = [];

	rewardRolesGiven = await syncStreakRoles(
		member,
		streak.currentStreak,
		rewards,
	);

	return { status, streak, rewardRolesGiven };
}

module.exports = {
	getOrCreateStreak,
	updateNickname,
	getTodayDateString,
	getYesterdayDateString,
	syncStreakRoles,
	claimStreak,
};
