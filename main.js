//le Plateau de jeu
var game = new Phaser.Game(600, 600);
var vitesse = 500;

//Notre jeu
var dodger = {
    preload: function () {
        //Chargement image
        game.load.image('fond', 'assets/fond.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('mechant', 'assets/mechant.png');
    },
    create: function () {
        //setup + affichage
        game.physics.startSystem(Phaser.Physics.ARCADE); //On charge la physique "arcade" du jeu

        game.add.sprite(0, 0, 'fond'); //L'image d'arrière-plan
        this.player = game.add.sprite(300, 500, 'player'); //Le sprite du joueur
        this.player.anchor.set(0.5); // Ici on centre le sprite du joueur en son milieu
        game.physics.arcade.enable(this.player); //Ici on active la physique pour le joueur

        this.cursors = game.input.keyboard.createCursorKeys(); //Ajout des actions en appuyant sur les touches du clavier

        this.mechants = game.add.group(); //Ajout du groupe 'mechants'

        this.timer = game.time.events.loop(200, this.ajouterUnMechant, this) //Timer d'apparition du 'mechant'

        //Affichage du score en haut à droite 
        this.score = 0
        this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#fff"});

    },
    update: function () {
        //Logique du jeu
        game.physics.arcade.overlap(this.player, this.mechants, this.restartGame, null, this); //Si collision entre le joueur et le mechant, le jeu redémarre à son état initial
        this.player.body.velocity.x = 0; // Reset de la vitesse à chaque input
        this.player.body.velocity.y = 0;
        //Controles : ici on attribut une direction pour chaque flèches du clavier. 
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = vitesse * -1; // La variable vitesse détemine la vélocité des objets
        }
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x = vitesse;
        }
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = vitesse * -1;
        }
        if (this.cursors.down.isDown) {
            this.player.body.velocity.y = vitesse;
        }
        if (this.player.inWorld == false) {
            this.restartGame();
        }
    },
    restartGame: function () {
        game.state.start('dodger');

    },
    ajouterUnMechant: function () {
        var position = Math.floor(Math.random() * 550) + 1;// variable qui détermine la position du 'mechant' aléatoirement
        var mechant = game.add.sprite(position, -50, 'mechant'); // Chargement du sprite du méchant à une position aléatoire en dehors de l'écran
        game.physics.arcade.enable(mechant); //Activation de la physique du mechant
        mechant.body.gravity.y = 200; //Ajout de la gravité pour que le mechant tombe vers le joueur

        this.mechants.add(mechant); //Ajout des 'mechant' au groupe 'mechants'

        //Ici on incrémente de 100 le score pour chaque ennemi généré
        this.score += 100;
        this.labelScore.text = this.score;

        mechant.checkWorldBounds = true; //Verification de la position du méchant, en dehors ou en dedans l'écran.
        mechant.outOfBoundsKill = true; //Si le méchant est en dehors de l'écran, il est supprimé de la mémoire.
    }
};

//Création de l'état de jeu
game.state.add('dodger', dodger);
//Démarrage de l'état de jeu
game.state.start('dodger');