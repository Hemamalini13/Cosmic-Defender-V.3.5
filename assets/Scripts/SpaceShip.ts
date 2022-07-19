import { _decorator, Component, Node, systemEvent, SystemEvent, Vec3, macro, Prefab, instantiate, director, CCObject, BoxCollider2D, BoxCollider, Collider, ColliderComponent, BoxColliderComponent, ICollisionEvent, RichText, PhysicsSystem2D, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpaceShip')
export class SpaceShip extends Component {

    moveLeft: number = 0;
    moveRight: number = 0;
    projectile: number = 0;
    curPos: Vec3;
    movePos: Vec3;

    @property(Node)
    Info: Node = null;

    @property(Node)
    GameOver: Node = null;

    @property(Prefab)
    projectilePrefab: Prefab = null;

    @property(Prefab)
    enemyPrefab: Prefab = null;

    playerLife: number = 3;
    k: number = 0;

    randNo = 0;

    @property(Prefab)
    live1Prefab: Prefab = null;

    @property(Prefab)
    live2Prefab: Prefab = null;

    @property(Prefab)
    live3Prefab: Prefab = null;

    @property(Prefab)
    live1DeadPrefab: Prefab = null;

    @property(Prefab)
    live2DeadPrefab: Prefab = null;

    @property(Prefab)
    live3DeadPrefab: Prefab = null;

    @property(RichText)
    Score: RichText = null;

    lives: Array<Node> = [];
    enemyShip: Array<Node> = [];
    projectiles: Array<Node> = [];
    canShoot: boolean = true;
    time: number;

    move(event) {
        switch(event.keyCode){
            case macro.KEY.left:
                this.moveLeft = 1;
                break;
            case macro.KEY.right:
                this.moveRight = 1;
                break;
            case macro.KEY.space:
                this.projectile = 1;
                break;
        }
    }

    stop(event) {
        switch(event.keyCode){
            case macro.KEY.left:
                this.moveLeft = 0;
                break;
            case macro.KEY.right:
                this.moveRight = 0;
                break;
            case macro.KEY.space:
                this.projectile = 0;
                break;
        }
    }

    start() {

        PhysicsSystem2D.instance.enable = true;

        let collider = this.getComponent(Collider2D);
        if (collider)
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);

        // Registering global contact callback functions
        if (PhysicsSystem2D.instance)
             PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);

        this.Info.active = true;
        this.GameOver.active = false;
        
        systemEvent.on(SystemEvent.EventType.KEY_DOWN,this.move,this);
        systemEvent.on(SystemEvent.EventType.KEY_UP,this.stop,this);
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.createEnemy, this);
    }

    update(deltaTime: number) {
        var curTime = director.getTotalTime();
        var dTime = curTime - this.time;
        if(dTime >= 500)
                this.canShoot = true;

        if(this.moveLeft == 1) {
            if(this.node.position.x <= -440) {
                this.node.setPosition(-440, this.node.position.y);
            } else {
                var posX = this.node.position.x;
                this.node.setPosition(posX -= 300*deltaTime, this.node.position.y);
            }
        } else if(this.moveRight == 1) {
            if(this.node.position.x >= 440) {
                this.node.setPosition(440, this.node.position.y);
            } else {
                var posX = this.node.position.x;
                this.node.setPosition(posX += 300*deltaTime, this.node.position.y);
            }
        } else if(this.projectile == 1) {
            if(this.canShoot)
                this.createProjectile();
        }
    }

    createProjectile() {
        this.canShoot = false;
        this.time = director.getTotalTime();
        var shoot = instantiate(this.projectilePrefab);
        shoot.setPosition(this.node.position.x, -220);
        this.node.parent.addChild(shoot);
        this.projectiles.push(shoot);
    }

    createEnemy() {
        systemEvent.off(SystemEvent.EventType.MOUSE_DOWN, this.createEnemy, this);
        this.Info.active = false;
        this.GameOver.active = false;
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 12; j++) {
                var enemies = instantiate(this.enemyPrefab);
                if(j==0) {
                    var posX = -440;
                    var posY = 250;
                    enemies.setPosition(posX, posY += 100*i);
                } else {
                    enemies.setPosition(posX += 80, posY);
                }
                this.node.parent.addChild(enemies);
                this.enemyShip.push(enemies);
            }
        }
        var l1d = instantiate(this.live1DeadPrefab);
        var l2d = instantiate(this.live2DeadPrefab);
        var l3d = instantiate(this.live3DeadPrefab);
        var l1 = instantiate(this.live1Prefab);
        var l2 = instantiate(this.live2Prefab);
        var l3 = instantiate(this.live3Prefab);

        this.node.parent.addChild(l1d);
        this.node.parent.addChild(l2d);
        this.node.parent.addChild(l3d);
        this.node.parent.addChild(l1);
        this.node.parent.addChild(l2);
        this.node.parent.addChild(l3);
        this.lives = [l1, l2, l3];
    }

    randomEnemyShoot() {
        this.randNo = Math.floor(Math.random()*48);
        
    }

    onCollisionEnter(event: ICollisionEvent) {
         if(event.otherCollider.node.name == "Enemy") {
             this.playerLife--;
             this.lives[this.k].destroy();
             this.k++;
             if (this.playerLife < 1)
             {
                this.GameOver.active = true;
                systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.createEnemy, this);
                this.node.setPosition(0, this.node.position.y);
             }
         }
    }
}

