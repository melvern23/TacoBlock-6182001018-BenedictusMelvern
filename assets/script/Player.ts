import { _decorator, CCFloat, Component, input, Input, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    @property({type: CCFloat})gravity:number;
    @property({type: Node})ground:Node;
    @property({type: Prefab})prefabBlock:Prefab;

    private vy:number = 0;
    private baseY:number = 0;
    private hBlock =49;

    start() {
        this.baseY = this.ground.getPosition().y+80;
        input.on(Input.EventType.TOUCH_START,this.spawnBlock,this);
    }

    spawnBlock(){
        let nodeBlock = instantiate(this.prefabBlock);
        nodeBlock.setParent(this.node.parent);
        nodeBlock.setPosition(new Vec3(0,this.baseY,0));
        this.baseY += this.hBlock;
    }

    update(deltaTime: number) {
        this.vy += this.gravity*deltaTime;
        this.node.translate(new Vec3(0,this.vy*deltaTime,0));
        let curPosition = this.node.getPosition();
        if(curPosition.y<this.baseY){
            curPosition.y = this.baseY;
        }
        this.node.setPosition(curPosition);
    }
}


