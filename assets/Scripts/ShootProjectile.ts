import { _decorator, Component, Node, director, BoxCollider2D, ColliderComponent, BoxColliderComponent, ICollisionEvent } from 'cc';
import { SpaceShip } from './SpaceShip';
const { ccclass, property } = _decorator;

@ccclass('ShootProjectile')
export class ShootProjectile extends Component {

    @property(SpaceShip)
    spaceShip: SpaceShip = null;

    start() {
          
    }

    update(deltaTime: number) {
        var posX = this.node.position.x;
        var posY = this.node.position.y;
        this.node.setPosition(posX, posY += 50*deltaTime);
        if(this.node.position.y > 320 || this.spaceShip.playerLife < 1) {
            this.node.destroy();
        }
    }
}

