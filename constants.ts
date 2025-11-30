import { Planet } from './types';

const TEXTURE_BASE = "https://raw.githubusercontent.com/yuriyy/solar-system/master/public/img";

export const PLANETS: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    au: 0.39,
    diameter: '4,880 km',
    mass: '0.055 Earths',
    volume: '0.056 Earths',
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    description: `Mercury is the smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days.

    From the surface of Mercury, the Sun would appear more than three times as large as it does when viewed from Earth, and the sunlight would be as much as seven times brighter. Despite its proximity to the Sun, Mercury is not the hottest planet in our solar system – that title belongs to nearby Venus, thanks to its dense atmosphere. But Mercury is the fastest planet, zipping around the Sun every 88 Earth days.

    **Formation**
    Mercury formed about 4.5 billion years ago when gravity pulled swirling gas and dust together to form this small planet nearest the Sun. Like its fellow terrestrial planets, Mercury has a central core, a rocky mantle, and a solid crust.

    **Orbit and Rotation**
    Mercury's highly eccentric, egg-shaped orbit takes the planet as close as 29 million miles (47 million kilometers) and as far as 43 million miles (70 million kilometers) from the Sun. It speeds around the Sun every 88 days, traveling through space at nearly 29 miles (47 kilometers) per second, faster than any other planet.

    Mercury spins slowly on its axis and completes one rotation every 59 Earth days. But when Mercury is moving fastest in its elliptical orbit around the Sun (and it is closest to the Sun), each rotation is not accompanied by a sunrise and sunset like on most other planets. The morning sun appears to rise briefly, set, and rise again from some parts of the planet's surface. The same thing happens at sunset for other parts of the surface. One solar day on Mercury (the time from one noon to the next) equals 176 Earth days—just over two years on Mercury.

    **Surface**
    Mercury's surface resembles that of Earth's Moon, scarred by many impact craters resulting from collisions with meteoroids and comets. Craters and features on Mercury are named after famous deceased artists, musicians, or authors, including children's author Dr. Seuss and dance pioneer Alvin Ailey.
    
    Very large impact basins, including Caloris (960 miles or 1,550 kilometers in diameter) and Rachmaninoff (190 miles, or 306 kilometers in diameter), were created by asteroid impacts on the planet's surface early in the solar system's history. While there are large areas of smooth terrain, there are also cliffs, some hundreds of miles long and soaring up to a mile high. They rose as the planet's interior cooled and contracted over the billions of years since Mercury formed.
    
    Most of Mercury's surface would appear greyish-brown to the human eye. The bright streaks are called "crater rays." They are formed when an asteroid or comet strikes the surface. The tremendous amount of energy that is released in such an impact digs a large hole in the ground, and also crushes a huge amount of rock. Some of this crushed rock is thrown far from the crater and then falls to the surface, forming the rays. Fine particles of crushed rock are more reflective than large pieces, so the rays look brighter. The space environment—dust impacts and solar-wind particles—causes the rays to darken with time.

    **Atmosphere**
    Instead of an atmosphere, Mercury possesses a thin exosphere made up of atoms blasted off the surface by the solar wind and striking meteoroids. Mercury's exosphere is composed mostly of oxygen, sodium, hydrogen, helium, and potassium.

    **Magnetosphere**
    Mercury's magnetic field is offset relative to the planet's equator. Though Mercury's magnetic field at the surface has just 1 percent the strength of Earth's, it interacts with the magnetic field of the solar wind to sometimes create intense magnetic tornadoes that funnel the fast, hot plasma of the solar wind down to the surface of the planet. When the ions strike the surface, they knock off neutrally charged atoms and send them on a loop high into the sky.

    **Potential for Life**
    Mercury's environment is not conducive to life as we know it. The temperatures and solar radiation that characterize this planet are most likely too extreme for organisms to adapt to.

    **Exploration**
    Because Mercury is so close to the Sun, it is hard to observe from Earth except during twilight. It is also difficult to reach with spacecraft because the Sun's gravity pulls on any object moving toward it. NASA's Mariner 10 was the first mission to explore Mercury (1974-1975). NASA's MESSENGER mission was the first to orbit Mercury (2011-2015). The joint ESA-JAXA BepiColombo mission is currently en route to Mercury.`,
    textureUrl: `${TEXTURE_BASE}/mercury.jpg`,
    color: '#A5A5A5',
    tempDay: 430,
    tempNight: -180
  },
  {
    id: 'venus',
    name: 'Venus',
    au: 0.72,
    diameter: '12,104 km',
    mass: '0.815 Earths',
    volume: '0.866 Earths',
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    description: `Spinning in the opposite direction to most planets, Venus is the hottest planet in our solar system. Its thick atmosphere traps heat in a runaway greenhouse effect.

    Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's one of the four inner, terrestrial (or rocky) planets, and it's often called Earth's twin because it's similar in size and density. These are not identical twins, however – there are radical differences between the two worlds.

    **Formation**
    Venus formed about 4.5 billion years ago when gravity pulled swirling gas and dust together to form this planet. Venus has a central iron core, a rocky mantle, and a solid crust.

    **Orbit and Rotation**
    Venus rotates on its axis backward, compared to most of the other planets in the solar system. This means that, on Venus, the Sun rises in the west and sets in the east, opposite of what we experience on Earth. (It's not the only planet in our solar system with such an odd rotation – Uranus spins on its side.)
    
    Venus rotates very slowly on its axis – one day on Venus lasts 243 Earth days. The planet orbits the Sun faster than Earth, however, so one year on Venus takes only about 225 Earth days, making a Venusian day longer than its year!

    **Surface**
    Venus has a thick, toxic atmosphere filled with carbon dioxide and it's perpetually shrouded in thick, yellowish clouds of sulfuric acid that trap heat, causing a runaway greenhouse effect. It's the hottest planet in our solar system, even though Mercury is closer to the Sun. Surface temperatures on Venus are about 900 degrees Fahrenheit (475 degrees Celsius) – hot enough to melt lead.
    
    The surface is a rusty color and it's peppered with intensely crunched mountains and thousands of large volcanoes. Scientists think it's possible some volcanoes are still active. Venus has crushing air pressure at its surface – more than 90 times that of Earth – similar to the pressure you'd encounter a mile below the ocean on Earth.

    **Structure**
    Venus is in many ways Earth's twin. It is approximately the same mass and has approximately the same diameter. However, there are crucial differences. Venus has no moon and no rings. Venus has a similar internal structure to Earth, with a metallic core, rocky mantle, and crust. The crust is thought to be 6 to 12 miles (10 to 20 kilometers) thick.

    **Atmosphere**
    Venus consists mainly of carbon dioxide, with clouds of sulfuric acid droplets. The thick atmosphere traps the Sun's heat, resulting in surface temperatures higher than 880 degrees Fahrenheit (470 degrees Celsius). The atmosphere is heavier than that of any other planet, leading to a surface pressure 90 times that of Earth.

    **Magnetosphere**
    Even though Venus is similar in size to Earth and has a similar-sized iron core, its magnetic field is much weaker than Earth's due to its slow rotation.

    **Observation and Exploration**
    Because it's so bright, Venus was the first planet to have its motions plotted across the sky, as early as the second millennium BC. More than 40 spacecraft have explored Venus. The Magellan mission in the early 1990s mapped 98% of the planet's surface. Future missions include NASA's DAVINCI+ and VERITAS, and ESA's EnVision.`,
    textureUrl: `${TEXTURE_BASE}/venus.jpg`,
    color: '#E3BB76',
    tempDay: 462,
    tempNight: 462
  },
  {
    id: 'earth',
    name: 'Earth',
    au: 1.00,
    diameter: '12,742 km',
    mass: '1.000 Earths',
    volume: '1.000 Earths',
    dayLength: '24 hours',
    yearLength: '365.25 days',
    description: `Our home planet is the third planet from the Sun, and the only place we know of so far that's inhabited by living things. It's the only world in our solar system with liquid water on the surface.

    Earth is the biggest of the terrestrial planets, and the fifth largest planet overall in our solar system. Earth is an ocean planet: 71 percent of the Earth's surface is covered by water. Earth's atmosphere protects us from the Sun's harmful radiation and from meteoroids, most of which burn up in the atmosphere before they can strike the surface.

    **Formation**
    Earth formed about 4.5 billion years ago when gravity pulled swirling gas and dust together to become the third planet from the Sun. Like its fellow terrestrial planets, Earth has a central core, a rocky mantle, and a solid crust.

    **Orbit and Rotation**
    As Earth orbits the Sun, it completes one rotation every 23.9 hours. It takes 365.25 days to complete one trip around the Sun. That extra quarter of a day presents a challenge to our calendar system, which counts one year as 365 days. To keep our yearly calendars consistent with our orbit around the Sun, every four years we add one day. That day is called a leap day, and the year it's added to is called a leap year.

    **Surface**
    Earth is a rocky planet with a solid and dynamic surface of mountains, canyons, plains and more. Most of our planet is covered in water. Earth's crust and upper mantle are divided into huge plates that are constantly moving. For example, the North American plate moves west over the Pacific Ocean basin, roughly at a rate equal to the growth of our fingernails. Earthquakes result when plates grind past one another, ride up over one another, collide to make mountains, or split and separate.

    **Atmosphere**
    Earth is the only planet that has an atmosphere containing 21 percent oxygen. It also has nitrogen (78 percent) and argon (0.9 percent) plus trace amounts of carbon dioxide, neon, helium, methane, krypton, hydrogen, nitrous oxide, xenon, ozone, iodine, carbon monoxide, and ammonia.

    **Magnetosphere**
    Our planet's rapid rotation and molten nickel-iron core give rise to a magnetic field, which the solar wind distorts into a teardrop shape in space. (The solar wind is a stream of charged particles continuously ejected from the Sun.) When charged particles from the solar wind become trapped in Earth's magnetic field, they collide with air molecules above our planet's magnetic poles. These air molecules then begin to glow and are known as the aurorae, or the northern and southern lights.

    **Moon**
    Earth is the only planet that has a single moon. Our Moon is the brightest and most familiar object in the night sky. In many ways, the Moon is responsible for making Earth such a great home. It stabilizes our planet's wobble, which has made the climate less variable over thousands of years.

    **Life**
    Earth is the only place in the universe known to harbor life. Evidence suggests that life has existed on Earth for at least 3.5 billion years, with the oldest physical traces of life dating back 3.7 billion years.`,
    textureUrl: `${TEXTURE_BASE}/earth.jpg`,
    color: '#22A6B3',
    tempDay: 20,
    tempNight: -10,
    moons: [
      {
        id: 'moon',
        name: 'The Moon',
        diameter: '3,475 km',
        mass: '0.012 Earths',
        description: `The Moon is Earth's only natural satellite. It is the fifth largest satellite in the Solar System and the largest and most massive relative to its parent planet.
        
        **Formation**
        The prevailing theory is that the Moon formed about 4.51 billion years ago, not long after Earth, out of the debris from a giant impact between the Earth and a Mars-sized body called Theia.
        
        **Surface**
        The Moon is in synchronous rotation with Earth, and thus always shows the same side to Earth, the near side. The near side is marked by dark volcanic maria that fill the spaces between the bright ancient crustal highlands and the prominent impact craters.
        
        **Human Exploration**
        The Moon is the only celestial body beyond Earth that has been visited by humans. The Soviet Union's Luna program was the first to reach the Moon with unmanned spacecraft in 1959. The United States' NASA Apollo program achieved the only crewed missions to date, beginning with the first manned lunar orbiting mission by Apollo 8 in 1968, and six manned lunar landings between 1969 and 1972, with the first being Apollo 11.`,
        textureUrl: `${TEXTURE_BASE}/moon.jpg`,
        color: '#E0E0E0'
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    au: 1.52,
    diameter: '6,779 km',
    mass: '0.107 Earths',
    volume: '0.151 Earths',
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    description: `Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence that Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.

    Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes, and evidence that it was even more active in the past. Mars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape.

    **Formation**
    Mars formed about 4.5 billion years ago when gravity pulled swirling gas and dust together to become the fourth planet from the Sun. Mars is about half the size of Earth, and like its fellow terrestrial planets, it has a central core, a rocky mantle, and a solid crust.

    **Orbit and Rotation**
    One day on Mars takes a little over 24 hours. Mars makes a complete orbit around the Sun (a year in Martian time) in 687 Earth days. Mars' axis of rotation is tilted 25 degrees with respect to the plane of its orbit around the Sun. This is another similarity with Earth, which has an axial tilt of 23.4 degrees. Like Earth, Mars has distinct seasons, but they last longer than seasons on Earth since Mars takes longer to orbit the Sun.

    **Surface**
    The Red Planet is actually many colors. At the surface, we see colors such as brown, gold, and tan. The reason Mars looks reddish is due to oxidization—or rusting—of iron in the rocks, regolith (Martian "soil"), and dust of Mars. This dust gets kicked up into the atmosphere and from a distance makes the planet appear mostly red.

    Interestingly, while Mars is about half the diameter of Earth, its surface has nearly the same area as Earth's dry land. Its volcanoes, impact craters, crustal movement, and atmospheric conditions such as dust storms have altered the landscape of Mars over many years, creating some of the solar system's most interesting topographical features.

    A large canyon system called Valles Marineris is long enough to stretch from California to New York – more than 3,000 miles (4,800 kilometers). This Martian canyon is 200 miles (320 kilometers) wide and up to 4.3 miles (7 kilometers) deep. That's about 10 times the size of Earth's Grand Canyon.

    Mars is home to the largest volcano in the solar system, Olympus Mons. It's three times taller than Earth's Mt. Everest with a base the size of the state of New Mexico.

    **Atmosphere**
    Mars has a thin atmosphere made up mostly of carbon dioxide, nitrogen, and argon gases. To our eyes, the sky would be hazy and red because of suspended dust instead of the familiar blue tint we see on Earth. Mars' sparse atmosphere doesn't offer much protection from impacts by such objects as meteorites, asteroids, and comets.

    **Moons**
    Mars has two small moons, Phobos and Deimos, that may be captured asteroids. They are potato-shaped because they have too little mass for gravity to make them spherical.

    **Potential for Life**
    Scientists don't expect to find living things currently thriving on Mars. Instead, they're looking for signs of life that existed long ago, when Mars was warmer and covered with water.`,
    textureUrl: `${TEXTURE_BASE}/mars.jpg`,
    color: '#E05935',
    tempDay: 20,
    tempNight: -73
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    au: 5.20,
    diameter: '139,820 km',
    mass: '317.8 Earths',
    volume: '1,321 Earths',
    dayLength: '10 hours',
    yearLength: '12 Earth years',
    description: `Jupiter has a long history of surprising scientists—all the way back to 1610 when Galileo Galilei found the first moons beyond Earth. It is massive, with a Great Red Spot storm larger than Earth.

    Jupiter is the fifth planet from the Sun and the largest in the solar system. It is a gas giant with mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the solar system combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history.

    **Formation**
    Jupiter took shape when the rest of the solar system formed about 4.5 billion years ago, when gravity pulled swirling gas and dust in to become this gas giant. Jupiter took most of the mass left over after the Sun formed, ending up with more than twice the combined material of the other bodies in the solar system. In fact, Jupiter has the same ingredients as a star, but it did not grow massive enough to ignite.

    **Orbit and Rotation**
    Jupiter has the shortest day in the solar system. One day on Jupiter takes only about 10 hours (the time it takes for Jupiter to rotate or spin around once), and Jupiter makes a complete orbit around the Sun (a year in Jovian time) in about 12 Earth years (4,333 Earth days). Its equator is tilted with respect to its orbital path around the Sun by just 3 degrees. This means Jupiter spins nearly upright and does not have seasons as extreme as other planets do.

    **Structure**
    Jupiter is composed primarily of hydrogen and helium. The atmosphere gets denser and denser with depth, and ultimately turns into a liquid metallic hydrogen interior. Deep in the atmosphere, pressure and temperature increase, compressing the hydrogen gas into a liquid. This gives Jupiter the largest ocean in the solar system—an ocean made of hydrogen instead of water. Scientists think that, at depths halfway to the planet's center, the pressure becomes so great that electrons are squeezed off the hydrogen atoms, making the liquid electrically conducting like metal. Jupiter's fast rotation runs electrical currents in this region, generating the planet's powerful magnetic field. It is still unclear if, deeper down, Jupiter has a central core of solid material or if it may be a thick, super-hot and dense soup. It could be up to 90,032 degrees Fahrenheit (50,000 degrees Celsius) down there.

    **Surface**
    As a gas giant, Jupiter doesn't have a true surface. The planet is mostly swirling gases and liquids. While a spacecraft would have nowhere to land on Jupiter, it wouldn't be able to fly through unscathed either. The extreme pressures and temperatures deep inside the planet crush, melt, and vaporize spacecraft trying to fly into the planet.

    **Great Red Spot**
    The Great Red Spot is a persistent high-pressure region in the atmosphere of Jupiter, producing an anticyclonic storm that is the largest in the solar system. Located 22 degrees south of Jupiter's equator, it produces wind speeds up to 432 km/h (268 mph). It is thought to have existed for at least 350 years.

    **Moons**
    Jupiter has 95 known moons. The four largest moons—Io, Europa, Ganymede, and Callisto—are known as the Galilean moons because they were discovered by Galileo Galilei in 1610. Ganymede is the largest moon in the solar system, even bigger than the planet Mercury.

    **Rings**
    Jupiter's ring system was discovered in 1979 by the Voyager 1 probe. It is faint and consists mainly of dust.`,
    textureUrl: `${TEXTURE_BASE}/jupiter.jpg`,
    color: '#D4A373',
    hasRings: false,
    tempDay: -110,
    tempNight: -110
  },
  {
    id: 'saturn',
    name: 'Saturn',
    au: 9.58,
    diameter: '116,460 km',
    mass: '95.2 Earths',
    volume: '764 Earths',
    dayLength: '10.7 hours',
    yearLength: '29 Earth years',
    description: `Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn's.

    Saturn is the sixth planet from the Sun and the second-largest in the solar system, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth. It has only one-eighth the average density of Earth; however, with its larger volume, Saturn is over 95 times more massive.

    **Formation**
    Saturn formed about 4.5 billion years ago when gravity pulled swirling gas and dust in to become this gas giant. About 4 billion years ago, Saturn settled into its current position in the outer solar system, where it is the sixth planet from the Sun. Like Jupiter, Saturn is mostly made of hydrogen and helium, the same two main components that make up the Sun.

    **Orbit and Rotation**
    One day on Saturn takes only 10.7 hours (the time it takes for Saturn to rotate or spin around once), and Saturn makes a complete orbit around the Sun (a year in Saturnian time) in about 29 Earth years (10,756 Earth days). Its axis is tilted by 26.73 degrees with respect to its orbit around the Sun, which is similar to Earth's 23.5-degree tilt. This means that, like Earth, Saturn experiences seasons.

    **Structure**
    Saturn consists mostly of hydrogen and helium. The outer atmosphere of Saturn is visible and appears as bands of yellow and gold. These are the result of super-fast winds in the upper atmosphere, which can reach up to 1,100 mph (1,800 km/h) around its equator, combined with heat rising from the planet's interior.

    Like Jupiter, Saturn has no true surface and is made of mostly gases and liquids deep down. Spacecraft would have nowhere to land on Saturn.

    **The Rings**
    Saturn is most famous for its rings. The rings are made of billions of chunks of ice and rock coated with other materials such as dust. The ring particles range in size from tiny, dust-sized icy grains to chunks as big as a house. A few particles are as large as mountains. The rings would look mostly white if you looked at them from the cloud tops of Saturn, and interestingly, each ring orbits at a different speed around the planet.

    Saturn's ring system extends up to 175,000 miles (282,000 kilometers) from the planet, yet the vertical height is typically about 30 feet (10 meters) in the main rings. Named alphabetically in the order they were discovered, the rings are relatively close to each other, with the exception of a gap measuring 2,920 miles (4,700 kilometers) wide called the Cassini Division that separates Rings A and B.

    **Moons**
    Saturn has 146 known moons, with Titan being the largest. Titan is the second-largest moon in the solar system and is larger than the planet Mercury. It is the only moon known to have a dense atmosphere and the only object in space other than Earth where clear evidence of stable bodies of surface liquid has been found.

    **Magnetosphere**
    Saturn's magnetic field is smaller than Jupiter's but still 578 times as powerful as Earth's. Saturn, the rings, and many of the satellites lie totally within Saturn's enormous magnetosphere, the region of space in which the behavior of electrically charged particles is influenced more by Saturn's magnetic field than by the solar wind.`,
    textureUrl: `${TEXTURE_BASE}/saturn.jpg`,
    color: '#EDD192',
    hasRings: true,
    ringColor: 'rgba(210, 180, 140, 0.6)',
    tempDay: -140,
    tempNight: -140
  },
  {
    id: 'uranus',
    name: 'Uranus',
    au: 19.22,
    diameter: '50,724 km',
    mass: '14.5 Earths',
    volume: '63 Earths',
    dayLength: '17 hours',
    yearLength: '84 Earth years',
    description: `Uranus rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side. It is an ice giant.

    Uranus is the seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus, who, according to Greek mythology, was the great-grandfather of Ares (Mars), grandfather of Zeus (Jupiter) and father of Cronus (Saturn). It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.

    **Formation**
    Uranus formed about 4.5 billion years ago when gravity pulled swirling gas and dust in to become this ice giant. Like its neighbor Neptune, Uranus is one of two ice giants in the outer solar system.

    **Orbit and Rotation**
    One day on Uranus takes about 17 hours (the time it takes for Uranus to rotate or spin once). Uranus makes a complete orbit around the Sun (a year in Uranian time) in about 84 Earth years (30,687 Earth days).

    Uranus is unique in that it rotates on its side. Its north and south poles are located where most other planets have their equators. This unique tilt causes the most extreme seasons in the solar system. For nearly a quarter of each Uranian year, the Sun shines directly over each pole, plunging the other half of the planet into a 21-year-long, dark winter.

    **Structure**
    Uranus is one of two ice giants in the outer solar system (the other is Neptune). Most (80 percent or more) of the planet's mass is made up of a hot dense fluid of "icy" materials—water, methane, and ammonia—above a small rocky core. Near the core, it heats up to 9,000 degrees Fahrenheit (4,982 degrees Celsius).

    **Atmosphere**
    Uranus gets its blue-green color from methane gas in the atmosphere. Sunlight passes through the atmosphere and is reflected back out by Uranus' cloud tops. Methane gas absorbs the red portion of the light, resulting in a blue-green color.

    The atmosphere is mostly hydrogen and helium, with a small amount of methane and traces of water and ammonia. The wind speeds on Uranus can reach up to 560 miles per hour (900 kilometers per hour). Winds are retrograde at the equator, blowing in the reverse direction of the planet's rotation. But closer to the poles, winds shift to a prograde direction, flowing with the planet's rotation.

    **Magnetosphere**
    Uranus has an unusual magnetic field. Magnetic fields are typically in alignment with a planet's rotation, but Uranus' magnetic field is tipped over: the magnetic axis is tilted nearly 60 degrees from the planet's axis of rotation, and is also offset from the center of the planet by one-third of the planet's radius.

    **Rings**
    Uranus has 13 known rings. The inner rings are narrow and dark and the outer rings are brightly colored. The rings are perpendicular to the solar system's orbital plane.

    **Moons**
    Uranus has 27 known moons. While most of the satellites orbiting other planets take their names from Greek or Roman mythology, Uranus' moons are unique in being named for characters from the works of William Shakespeare and Alexander Pope.`,
    textureUrl: `${TEXTURE_BASE}/uranus.jpg`,
    color: '#7DE3F4',
    tempDay: -195,
    tempNight: -195
  },
  {
    id: 'neptune',
    name: 'Neptune',
    au: 30.05,
    diameter: '49,244 km',
    mass: '17.1 Earths',
    volume: '58 Earths',
    dayLength: '16 hours',
    yearLength: '165 Earth years',
    description: `Neptune is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations. It is more than 30 times as far from the Sun as Earth.

    Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, slightly more massive than its near-twin Uranus.

    **Formation**
    Neptune formed about 4.5 billion years ago when gravity pulled swirling gas and dust in to become this ice giant. Like its neighbor Uranus, Neptune is one of two ice giants in the outer solar system.

    **Orbit and Rotation**
    One day on Neptune takes about 16 hours (the time it takes for Neptune to rotate or spin once). Neptune makes a complete orbit around the Sun (a year in Neptunian time) in about 165 Earth years (60,190 Earth days).

    Sometimes Neptune is even farther from the Sun than the dwarf planet Pluto. Pluto's highly eccentric, oval-shaped orbit brings it inside Neptune's orbit for a 20-year period every 248 Earth years. This switch, in which Pluto is closer to the Sun than Neptune, happened most recently from 1979 to 1999. Pluto can never crash into Neptune, though, because for every three laps Neptune takes around the Sun, Pluto makes two. This repeating pattern prevents close approaches of the two bodies.

    **Structure**
    Neptune is an ice giant. Most of its mass is a hot, dense fluid of "icy" materials—water, methane, and ammonia—above a small rocky core. Scientists think there might be an ocean of super hot water under Neptune's cold clouds. It does not boil away because incredibly high pressure keeps it locked inside.

    **Atmosphere**
    Neptune's atmosphere is made up of hydrogen, helium, and methane. The methane gives Neptune the same blue color as Uranus. Neptune has the windiest atmosphere in the solar system. Winds whip clouds of frozen methane across the planet at speeds of more than 1,200 mph (2,000 km/h)—close to the top speed of a U.S. Navy F/A-18 Hornet fighter jet. Earth's most powerful winds hit only about 250 mph (400 km/h).

    **Magnetosphere**
    The main axis of Neptune's magnetic field is tipped over by about 47 degrees compared with the planet's rotation axis. Like Uranus, whose magnetic axis is tilted about 60 degrees from the axis of rotation, Neptune's magnetosphere undergoes wild variations during each rotation because of this misalignment.

    **Rings**
    Neptune has five known rings. Starting near the planet and moving outward, they are named Galle, Le Verrier, Lassell, Arago, and Adams. The rings are thought to be relatively young and short-lived.

    **Moons**
    Neptune has 14 known moons. Triton is the largest Neptunian moon and the only large moon in the solar system that orbits in the opposite direction of its planet's rotation, a retrograde orbit. This suggests that Triton may have been captured by Neptune's gravity long ago.`,
    textureUrl: `${TEXTURE_BASE}/neptune.jpg`,
    color: '#3C64F4',
    tempDay: -200,
    tempNight: -200
  },
  {
    id: 'pluto',
    name: 'Pluto',
    au: 39.48,
    diameter: '2,376 km',
    mass: '0.002 Earths',
    volume: '0.006 Earths',
    dayLength: '153 hours',
    yearLength: '248 Earth years',
    description: `Because who doesn't like Pluto?
    
    Once classified as the ninth planet, this dwarf planet resides in the Kuiper Belt. It is a complex world of ice mountains and frozen plains.

    Pluto was discovered in 1930 by Clyde Tombaugh and was originally considered to be the ninth planet from the Sun. After 1992, its status as a planet was questioned following the discovery of several objects of similar size in the Kuiper belt. In 2006, the International Astronomical Union (IAU) formally redefined the term planet, excluding Pluto and reclassifying it as a dwarf planet.

    **Formation**
    Pluto is part of the Kuiper Belt, a vast region of the outer solar system beyond Neptune. It is a ring of icy bodies, thought to be remnants from the solar system's formation 4.5 billion years ago.

    **Orbit and Rotation**
    Pluto's orbit around the Sun is unusual compared to the planets: it's both elliptical and tilted. Pluto's 248-year-long, oval-shaped orbit can take it as far as 49.3 astronomical units (AU) from the Sun, and as close as 30 AU. (One AU is the mean distance between Earth and the Sun: about 93 million miles or 150 million kilometers.)

    From 1979 to 1999, Pluto was actually closer to the Sun than Neptune. One day on Pluto takes about 153 hours. Its axis of rotation is tilted 57 degrees with respect to the plane of its orbit around the Sun, so it spins almost on its side. Pluto also exhibits a retrograde rotation; spinning from east to west like Venus and Uranus.

    **Surface**
    Pluto is a complex world of ice mountains and frozen plains. The most famous feature on Pluto is a large heart-shaped region known as Tombaugh Regio. The left side of the heart (Sputnik Planitia) is a vast ice plain, while the right side consists of high-lands and mountains.
    
    Pluto's mountains can reach heights of 6,500 to 9,800 feet (2 to 3 kilometers) and are made of water ice. The surface temperature is extremely cold, around -375 to -400 degrees Fahrenheit (-225 to -240 degrees Celsius). At these temperatures, water ice is as hard as rock.

    **Structure**
    Pluto is about two-thirds the diameter of Earth's Moon and probably has a rocky core surrounded by a mantle of water ice. Interesting ices like methane and nitrogen frost coat its surface. Due to its lower density, Pluto's mass is about one-sixth that of Earth's Moon.

    **Atmosphere**
    Pluto has a thin, tenuous atmosphere that expands when it comes closer to the Sun and collapses as it moves farther away - similar to a comet. The main constituent is molecular nitrogen, though molecules of methane and carbon monoxide have also been detected.

    **Moons**
    Pluto has five known moons: Charon, Nix, Hydra, Kerberos, and Styx. Charon is the largest, being about half the size of Pluto itself, making them a binary system since they orbit a common center of mass outside of Pluto.

    **Exploration**
    NASA's New Horizons spacecraft is the only mission to have visited Pluto. It flew by the dwarf planet in July 2015, capturing the first close-up images of Pluto and its moons, transforming our understanding of these distant worlds.`,
    textureUrl: `${TEXTURE_BASE}/pluto.jpg`,
    color: '#E1C699',
    tempDay: -225,
    tempNight: -240
  }
];