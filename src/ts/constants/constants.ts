import { BlobType, BlobTypeStyle } from "../types/index.js";

export const blobColor = {
  RED: "red",
  BLUE: "blue",
  GREEN: "green",
  ORANGE: "orange",
} as const;

export const blobColors = Object.values(blobColor);

export const blobType = {
  TRUTH: "truth",
  LIE: "lie"
} as const;

export const groupSide = {
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom"
} as const;

export const groupSides = Object.values(groupSide);

export const blobNamesENUS = [
  "Blinky", "Squishy", "Fluffy", "Nibbles", "Puff", "Wiggly", "Bounce",
  "Glimmer", "Twinkle", "Puddle", "Wobble", "Sprout", "Frolic", "Pip",
  "Flick", "Chirp", "Drift", "Blip", "Glow", "Bubba", "Fizzy",
  "Whimsy", "Munch", "Splash", "Zippy", "Doodle", "Nuzzle", "Shimmer",
  "Jelly", "Squidge", "Gusto", "Bloop", "Nibble", "Whisk", "Scoot",
  "Pippin", "Mellow", "Ripple", "Jolly", "Chuck", "Snappy", "Crinkle",
  "Smidge", "Lumpy", "Dimples", "Bungee", "Hopper", "Wheeze", "Glee",
  "Pebble", "Tutter", "Wisp", "Fumble", "Cuddle", "Fizz", "Plop", "Shimmy",
  "Grin", "Plunk", "Blob", "Squirt", "Squash", "Splodge", "Glance", "Bump",
  "Giggle", "Quirk", "Pop", "Zap", "Swoosh", "Blurp", "Whirl", "Mirth",
  "Flutter", "Pookie", "Rustle", "Gobs", "Scramble", "Snug", "Perky", "Pixie",
  "Gurgle", "Knick", "Knack", "Tweak", "Squig", "Snuggle", "Tinkle", "Zoom",
  "Yip", "Teeny", "Spice", "Spook", "Sugar", "Blitz", "Crumb", "Dot", "Buzzy",
  "Dink", "Howl", "Itch", "Hush", "Loopy", "Mimic", "Nomad", "Fluff", "Mojo",
  "Nappy", "Paddy", "Rusty", "Skipper", "Snooze", "Thud", "Triff", "Splotch",
  "Roo", "Chubby", "Pom-Pom", "Stuff", "Streak", "Dabble", "Snick", "Whizz",
  "Starry", "Peppy", "Clip", "Flip", "Fuzzy", "Cloud", "Skip", "Squawk",
  "Gob", "Granny", "Trix", "Boppy", "Chuckle", "Whisper", "Pup",
  "Hops", "Snaps", "Dotty", "Twig", "Maple", "Berry", "Finny",
  "Sniff", "Jazz", "Hum", "Sprung", "Loop", "Butt", "Frizz", "Slope",
  "Mock", "Giddy", "Jot", "Beetle", "Spunky", "Dash", "Spike", "Tiny", "Spray",
  "Woody", "Fudge", "Yarn", "Rasp", "Blink", "Drizzle", "Fang", "Claws", "Joy",
  "Millie", "Seabass", "Spark", "Tum", "Tango", "Crispy", "Marsh", "Pal",
  "Becky", "Wink", "Grace", "Sprinkles", "Bubblegum", "Cob", "Slap", "Drip",
  "Vibes", "Belinda", "Cha", "Missy", "Mr. B", "Pipsqueak", "Jest", "Purdy"
];

export const blobNamesPTBR = [
  "Pipo", "Bingo", "Toddy", "Bolota", "Frida", "Nina", "Leo", "Pitoco",
  "Peludo", "Mimi", "Dudu", "Fuba", "Tico", "Bidu", "Catita", "Lili",
  "Pompom", "Biju", "Chiquinho", "Panda", "Toto", "Tata", "Rabito",
  "Teco", "Titi", "Fofo", "Rex", "Toquinho", "Teca", "Lilo",
  "Minty", "Xereta", "Pop", "Kiko", "Mel", "Zeus", "Bento",
  "Biruta", "Lua", "Cookie", "Luna", "Pipoca", "Zuzu", "Biscoito",
  "Felix", "Bolinha", "Jujuba", "Bizu", "Bilu", "Panqueca", "Caramelo",
  "Rubi", "Cacau", "Mei", "Amora", "Bigode", "Feijao", "Preta", "Milk",
  "Guga", "Jade", "Snow", "Doce", "Lilica", "Vivi", "Magali", "Sol",
  "Catatau", "Alvin", "Lolita", "Romeu", "Xodo", "Mini", "Yuri", "Brisa",
  "Formiga", "Estrela", "Sofi", "Torni", "Gigi", "Timao", "Batata",
  "Zaza", "Mancha", "Nino", "Pirata", "Bobby", "Bella", "Pluto", "Xuxu",
  "Joy", "Lupi", "Fifi", "Sushi", "Billy", "Honey", "Miuda",
  "Sid", "Sandy", "Babi", "Babu", "Blitz", "Miki", "Miro", "Tango",
  "Bolt", "Nene", "Skye", "Poof", "Luz", "Fluffy", "Boop", "Starry",
  "Bug", "Chirpy", "Hobbit", "Tutu", "Pluma", "Pingo", "Gizmo",
  "Docinho", "Marsh", "Dali", "Ivy", "Kurumi", "Blu", "Banana", "Foxy",
  "Goma", "Fanta", "Pirulito", "Tommy", "Rei", "Carlota", "Chorão", "Cria",
  "Gummy", "Minie", "Moc", "Pepe", "Goldu", "Scooby", "Zenny",
  "Trufa", "Zorro", "Bubu", "Ziggy", "Lolly", "Moti", "Totty", "Petty",
  "Moly", "Simba", "Bruno", "Blush", "Lupe", "Lupin", "Neve",
  "Keyan", "Corgan", "Sipher", "Luiza", "Pedro", "Lucas", "Kirari",
  "Leozin", "Thunder", "Vulpis", "Crono", "Bonny", "Theo"
];
