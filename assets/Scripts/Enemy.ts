import { _decorator, Component, Node, Prefab, instantiate, ColliderComponent, BoxColliderComponent, ICollisionEvent, BoxCollider2D, director, computeRatioByType, Collider2D, Contact2DType, PhysicsSystem2D, IPhysics2DContact, RigidBody2D } from 'cc';
import { ShootProjectile } from './ShootProjectile';
import { SpaceShip } from './SpaceShip';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property(Prefab)
    enemyShootPrefab: Prefab = null;

    @property(SpaceShip)
    spaceShip: SpaceShip = null;

    posX = 0;
    posY = 0;

    addScore = 0;

    start() {
        PhysicsSystem2D.instance.enable = true;
        
        // var manager = director.getCollisionManager();
        // manager.enabled = true;

        // this.getComponent(RigidBody2D);
        let collider = this.getComponent(Collider2D);
        // if (collider)
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);

        // Registering global contact callback functions
        // if (PhysicsSystem2D.instance)
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    // TAGS
    //      1 - SpaceShip
    //      2 - Projectile
    //      3 - Enemy
    //      4 - Enemy Projectile

    onCollisionEnter(otherCollider: Collider2D, selfCollider: Collider2D) {
        if(otherCollider.tag == 2) {
            this.node.destroy();
            otherCollider.node.destroy();
            this.addScore += 100;
        }
    }

    /*
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.tag === 2) {
            this.node.destroy();
            otherCollider.node.destroy();
            this.addScore += 100;
            this.spaceShip.Score.string = "Score: " + this.addScore.toString();
        }
        if(otherCollider.tag === 1) {
            this.spaceShip.playerLife--;
            this.node.destroy();
        }
    }
    */

    // onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D) {
    //     if(otherCollider.tag === 2) {
    //         this.node.destroy();
    //         this.addScore += 100;
    //         this.spaceShip.Score.string = "Score: " + this.addScore.toString();
    //     }
    // }

    update(deltaTime: number) {
        this.posX = this.node.position.x;
        this.posY = this.node.position.y;
        this.node.setPosition(this.posX, this.posY -= 5*deltaTime);
        
        if(this.node.position.y < -320) {
            this.node.destroy();
            this.spaceShip.playerLife--;   
        }

        // for(let p = 0; p < this.spaceShip.projectiles.length; p++) {
        //     var posX = this.node.position.x;
        //     var posY = this.node.position.y;
        //     if(((posY -= 60) <= this.spaceShip.projectiles[p].position.y) &&
        //         (this.spaceShip.projectiles[p].position.y <= (posY += 60)) && 
        //             ((posX -= 40) <= this.spaceShip.projectiles[p].position.x) && 
        //             (this.spaceShip.projectiles[p].position.x) <= (posX += 40)) {
        //                     this.spaceShip.projectiles[p].destroy();
        //                     this.node.destroy();
        //                      break;
        //     }
        // }

        if(this.spaceShip.playerLife < 1)
            this.node.destroy();
    }

    generateBullet() {
        var enemyShoot = instantiate(this.enemyShootPrefab);
        enemyShoot.setPosition(this.posX, this.posY -= 60);
        this.node.parent.addChild(enemyShoot);
    }
}

