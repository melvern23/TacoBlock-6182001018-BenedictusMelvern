import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt } from 'cc';
import { GroupObstacle } from './GroupObstacle';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type: Node})ground:Node;
    @property({type: Node})playerNode:Node;
    @property({type: Prefab})groupObstacle:Prefab;
    private baseY:number = 0;

    private listObstacleActive:Node[] = [];
    private player:Player;

    private poolObstacle:Node[] = [];

    start() {
        this.baseY = this.ground.getPosition().y+40;
        
        this.player = this.playerNode.getComponent(Player);
        setInterval(()=>{
            this.generateObstacle();
        },5000);
    }

    getObstacle():Node{
        // if(this.poolObstacle.length>0){
        //     return this.poolObstacle.shift();
        // }else{
        //     return instantiate(this.groupObstacle);
        // }
        return instantiate(this.groupObstacle);
    }

    generateObstacle(){
        let obs1 = this.getObstacle();
        obs1.setParent(this.node);
        obs1.getComponent(GroupObstacle).setHeight(randomRangeInt(2,4),this.baseY,this.poolObstacle);
        this.listObstacleActive.push(obs1);
    }

    update(deltaTime: number) {
        for(let i=0;i<this.listObstacleActive.length;i++){
            let obstacle = this.listObstacleActive[i];
            let groupObstacle = obstacle.getComponent(GroupObstacle);
            if(obstacle.position.x+38+43<=this.playerNode.position.x){
                if(groupObstacle.isHaveCutHeight()==false){
                    groupObstacle.setHaveCutHeight(true);
                    let obsHeight = groupObstacle.getHeight();
                    this.player.cutHeight(obsHeight);
                }
            }
            if(obstacle.position.x<=this.playerNode.position.x){
                if(groupObstacle.isHaveCheckCollision()==false){
                    let obsHeight = groupObstacle.getHeight();
                    groupObstacle.setHaveCheckCollision(true);
                    if(this.player.getHeight() >= obsHeight){
                        this.player.cutPlayer(obsHeight,obstacle);
                    }else{
                        this.player.gameOver();
                    }
                }
            }
            if(obstacle.position.x<=-192){
                this.listObstacleActive[i].active = false;
            }
        }
        for(let j=this.listObstacleActive.length-1;j>=0;j--){
            console.log("cek: j: "+j+" "+this.listObstacleActive[j].active)
            if(this.listObstacleActive[j].active==false){
                let toRemove = this.listObstacleActive[j];
                this.listObstacleActive.splice(j,1);
                for(let i=0;i<toRemove.children.length;i++){
                    if(toRemove.children[i].name="Obstacle"){
                        this.poolObstacle.push(toRemove.children[i]);
                    }else{

                    }
                }
                toRemove.removeAllChildren();
            }
        }
        
    }
}

