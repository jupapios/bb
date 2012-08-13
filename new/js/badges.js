var Badges = {
	list: [
		{
			  id: 'beta-tester'
			, title: 'Beta Tester'
			, description : 'The Beta Tester Badge was given to Beta Testers who took part in the Beta Period for Caju Game.'
		}
	],	
	/*list: [
		{
			  id: 'beta-tester'
			, active: true
			, title: 'Beta Tester'
			, description : 'le description'
		}
		, {
			  id: 'strategist'
			, active: false
			, title: 'Strategist'
			, description : 'le description'
		}
		, {
			  id: 'team'
			, active: false
			, title: 'Caju Team'
			, description : 'le description'
		}
		, {
			  id: 'wins-100'
			, active: false
			, title: 'Winner Master'
			, description : 'le description'
		}
		, {
			  id: 'agile'
			, active: false
			, title: 'Agile'
			, description : 'le description'
		}
	],*/
	getAll: function () {
		cajuBadges = DB.get('caju_badges');
		if(!cajuBadges) {
			cajuBadges = this.list;
			DB.save("caju_badges", cajuBadges);
		}
		return cajuBadges;
	},

	add: function (badge) {
		cajuBadges = DB.get('caju_badges');
		cajuBadges.push(badge);
		DB.save("caju_badges", cajuBadges);
	}

}