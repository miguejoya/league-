'use strict';
const riotKey = 'api_key=RGAPI-11340ebe-74e9-4a7a-b0e5-c1cca9bed436';
///////////////////////////////
const summonerName = document.querySelector('.summoner-name');
const summonerIcon = document.querySelector('.summoner-icon');
const summonerLvl = document.querySelector('.summoner-lvl');
const contenedorPartidas = document.querySelector('.contenedor-partidas');
const rankTier = document.querySelector('.rank-tier');
const summonerRank = document.querySelector('.summoner-rank');
const summonerLp = document.querySelector('.league-points');
const rankIcon = document.querySelector('.rank-icon');

const riotApi = async function (inGameName) {
  const link = `https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${inGameName}?${riotKey}`;
  const resRiot = await fetch(link);
  if (!resRiot.ok) throw new Error('Problem with riot api');

  const data = await resRiot.json();

  const resMatches = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${data.puuid}/ids?${riotKey}`
  );
  if (!resMatches.ok) throw new Error('Problem with riot matches api');

  const dataMatches = await resMatches.json();

  let matchDataObject = [];

  for (let i = 0; i < dataMatches.length; i++) {
    const matchId = dataMatches[i];

    const dataMatchesInfo = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?${riotKey}`
    );
    const matchesInfo = await dataMatchesInfo.json();

    matchDataObject.push(matchesInfo);
    matchDataObject.splice(5, 19);
  }

  const summonerSpellJ = await fetch(
    `http://ddragon.leagueoflegends.com/cdn/12.16.1/data/en_US/summoner.json`
  );

  const summonerS = await summonerSpellJ.json();

  const summonerRank = await fetch(
    `https://la1.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?${riotKey}`
  );

  const summRank = await summonerRank.json();

  return [data, matchDataObject, summonerS, summRank];
};

const date = timestamp => {
  const date = Date.now();
  const days = Math.round((date - timestamp) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((date - timestamp) / (1000 * 60 * 60)) % 24;

  if (hours < 24) return `${hours} hours ago`;

  if (days === 1) return `a day ago`;

  if (days > 1) return `${days} days ago`;
};

//codigo
riotApi('Opie Taylor').then(response => {
  console.log(response[0], response[1], response[2], response[3]);
  summonerName.textContent = response[0].name;
  summonerIcon.src = `http://ddragon.leagueoflegends.com/cdn/12.15.1/img/profileicon/${response[0].profileIconId}.png`;
  summonerLvl.textContent = response[0].summonerLevel;

  //rank
  rankTier.textContent = response[3][0].tier;
  summonerRank.textContent = response[3][0].rank;
  summonerLp.textContent = `${response[3][0].leaguePoints} LP`;
  rankIcon.src = `/ranked-emblems/Emblem_${response[3][0].tier}.png`;

  response[1].reverse();

  //Match account with participant
  const matchPuuid = players =>
    players.filter(namePuuid => namePuuid.puuid === response[0].puuid);

  //Get champion icon
  const championIcon = data =>
    matchPuuid(data.info.participants)
      .map(id => id.championName)
      .flat();

  console.log(championIcon);

  //Match Type
  const matchType = data => data.info.gameMode;

  console.log(matchType);

  //Resultado de partida W/L
  const matchResult = data =>
    matchPuuid(data.info.participants)
      .map(wl => (wl.win ? 'Victory' : 'Defeat'))
      .flat();

  //Days Ago
  // const matchDays = response[1].map(gameData => gameData.info.gameEndTimestamp);

  // console.log(matchDays);

  //Get Match duration
  const matchTime = data => Math.round(data.info.gameDuration / 60);

  console.log(matchTime);

  //Get Summoner Spell Key
  const entrien = Object.entries(response[2].data);
  const getKey = function (summId) {
    for (const [keys, { key, id }] of entrien) {
      if (key == summId) {
        return [id];
      }
    }
  };

  //Summoner Spells ids
  const summonerId = data =>
    matchPuuid(data.info.participants)
      .map(id => getKey(id.summoner1Id))
      .flat();
  console.log(summonerId);

  const summonerId2 = data =>
    matchPuuid(data.info.participants)
      .map(id => getKey(id.summoner2Id))
      .flat();

  // Items Icon

  const itemsBought0 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item0 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item0}.png"`;
        }
      })
      .flat();

  const itemsBought1 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item1 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item1}.png"`;
        }
      })
      .flat();

  const itemsBought2 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item2 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item2}.png"`;
        }
      })
      .flat();

  const itemsBought3 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item3 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item3}.png"`;
        }
      })
      .flat();

  const itemsBought4 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item4 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item4}.png"`;
        }
      })
      .flat();

  const itemsBought5 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item5 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item5}.png"`;
        }
      })
      .flat();

  const itemsBought6 = data =>
    matchPuuid(data.info.participants)
      .map(id => {
        if (id.item6 === 0) {
          return;
        } else {
          return `src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/item/${id.item6}.png"`;
        }
      })
      .flat();

  // KDA
  const playerKills = data =>
    matchPuuid(data.info.participants)
      .map(id => id.kills)
      .flat();

  const playerAssists = data =>
    matchPuuid(data.info.participants)
      .map(id => id.assists)
      .flat();

  const playerDeaths = data =>
    matchPuuid(data.info.participants)
      .map(id => id.deaths)
      .flat();

  //filter team
  const matchTeam = (players, team) =>
    players.filter(players => players.teamId === team);

  //summonerName
  const team1 = data =>
    matchTeam(data.info.participants, 100).map(
      summName => summName.summonerName
    );

  const team2 = data =>
    matchTeam(data.info.participants, 200).map(
      summName => summName.summonerName
    );

  //champion icon
  const championTeam1 = data =>
    matchTeam(data.info.participants, 100)
      .map(id => id.championName)
      .flat();

  const championTeam2 = data =>
    matchTeam(data.info.participants, 200)
      .map(id => id.championName)
      .flat();
  response[1].map(gameData => {
    const html = `
    <li class ="lista-juegos">
    <div class="resultados">
    
    <div class="info-juego">
    <p class="tipo">${matchType(gameData)}</p>
    <p class="fecha">${date(gameData.info.gameEndTimestamp)}</p>
    <p class="resultado">${matchResult(gameData)}</p>
    <p class="tiempo">${matchTime(gameData)}m</p>
    </div>
    
    
    <div class="result-info">

    <div class="campeon">
  
    <div class="icono-partida">
    <img class="match-champ-icon" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${championIcon(
      gameData
    )}.png`}" width="48" height="48"></img>
    </div>

    <div class="summoner-spells">
    <img class="summoner-spell-1" src="${`http://ddragon.leagueoflegends.com/cdn/12.16.1/img/spell/${summonerId(
      gameData
    )}.png`}"/>
    <img class="summoner-spell-2" src="${`http://ddragon.leagueoflegends.com/cdn/12.16.1/img/spell/${summonerId2(
      gameData
    )}.png`}"/>
    </div>
    
    

    <div class="kda">
     <p>${playerKills(gameData)} / ${playerDeaths(gameData)} / ${playerAssists(
      gameData
    )}</p>
    </div>

    </div>

    <div class="contenedor-items">

    <ul class="list-items">
    <li>
    <img class="icon-img" ${itemsBought0(gameData)} />
    </li>
    <li>
    <img class="icon-img" ${itemsBought1(gameData)} />
    </li>
    <li>
    <img class="icon-img" ${itemsBought2(gameData)} />
    </li>
    <li>
    <img class="icon-img" ${itemsBought3(gameData)} />
    </li>
    <li>
    <img class="icon-img" ${itemsBought4(gameData)} />
    </li>
    <li>
    <img class="icon-img" ${itemsBought5(gameData)} />
    </li>
    <li>
    <img class="icon-img" ${itemsBought6(gameData)} />
    </li>
    </ul>
    </div>

   </div>

   <div class="contenedor-teams">
   <ul class ="team-one">
   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam1(gameData)[0]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team1(gameData)[0]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam1(gameData)[1]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team1(gameData)[1]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam1(gameData)[2]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team1(gameData)[2]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam1(gameData)[3]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team1(gameData)[3]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam1(gameData)[4]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team1(gameData)[4]}</p>
   </div>
   </li>
  </ul>

   <ul class ="team-one">
   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam2(gameData)[0]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team2(gameData)[0]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam2(gameData)[1]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team2(gameData)[1]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam2(gameData)[2]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team2(gameData)[2]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam2(gameData)[3]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team2(gameData)[3]}</p>
   </div>
   </li>

   <li class="team1-list">
   <div class ="conetedor-team-icon">
   <img class="team1-champs" src="${`http://ddragon.leagueoflegends.com/cdn/12.15.1/img/champion/${
     championTeam2(gameData)[4]
   }.png`}" width="16" height="16"></img>
   </div>
   <div>
   <p>${team2(gameData)[4]}</p>
   </div>
   </li>

   </ul>
   </div>
   
    
    </div>
    </li>
    `;

    contenedorPartidas.insertAdjacentHTML('afterbegin', html);
  });
});

const arre = [23, 34, 23];
console.log(arre);
