const GITHUB_USER = 'LeopoldDePalma';
const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const CC_BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/';

export const site = {
  email: 'maggot-step.4h@icloud.com',
  links: {
    source: `${GITHUB_PROFILE}/leopold-homepage`,
    heraldry: 'https://wappenwiki.org/index.php/Main_Page',
  },
  profiles: {
    linkedin: {name: 'LinkedIn', url: 'https://www.linkedin.com'},
    github: {name: 'GitHub', url: GITHUB_PROFILE, handle: `@${GITHUB_USER}`},
  },
  armsCredit: {
    arms: 'https://commons.wikimedia.org/wiki/File:Arms_of_Swabia_(lions_passant_guardant).svg',
    ssolbergj: 'https://commons.wikimedia.org/wiki/User:Ssolbergj',
    whiteLion: 'https://commons.wikimedia.org/wiki/User:The_White_Lion',
    license: CC_BY_SA_4,
  },
  gameArtCredit: {
    knight: 'https://game-icons.net/1x1/skoll/mounted-knight.html',
    barrel: 'https://game-icons.net/1x1/delapouite/barrel.html',
    stakes: 'https://game-icons.net/1x1/delapouite/stakes-fence.html',
    caltrops: 'https://game-icons.net/1x1/delapouite/caltrops.html',
    source: 'https://game-icons.net',
    license: 'https://creativecommons.org/licenses/by/3.0/',
  },
  modelCredit: {
    model:
      'https://sketchfab.com/3d-models/helmet-with-grotesque-visor-d1438344826a4ff9b97dd35ccd56f535',
    author: 'https://sketchfab.com/TheRoyalArmoury',
    license: CC_BY_SA_4,
  },
} as const;
