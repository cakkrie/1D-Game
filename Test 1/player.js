class PlayerOne {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.score = 0;
        this.displaySize = _displaySize;
    }

    move(_direction) {
        let nextPosition = this.position + _direction;

        if (nextPosition == -1) {
            nextPosition = this.displaySize - 1;
        } else if (nextPosition == this.displaySize) {
            nextPosition = 0;
        }

        if (!rocks.includes(nextPosition)) {
            this.position = nextPosition;
        }
    } 
}

class PlayerTwo {
  
    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.score = 0;
        this.displaySize = _displaySize;
        this.isExploding = false; // 标记是否正在爆炸
        this.explosionSize = 1;  // 默认爆炸大小为1
        this.explosionStartTime = 0;  // 记录爆炸开始时间
        this.explodingRock = -1; // 标记哪个rock正在爆炸
        this.flashColor = false; // 用于实现闪烁效果
    }

    move(_direction) {
        this.position = this.position + _direction;
      
        if (this.position == -1) {
            this.position = this.displaySize - 1;
        } else if (this.position == this.displaySize) {
            this.position = 0;
        } 
    }

    explode() {
        // 实现闪烁效果
        let explosionColor = this.flashColor ? color(255, 0, 0) : color(255, 255, 255);
        this.flashColor = !this.flashColor; // 每帧切换颜色，产生闪烁效果
        
        // 显示爆炸的中心点（rock位置）
        display.setPixel(this.explodingRock, explosionColor);
        
        // 扩展爆炸的左右各1像素
        for (let i = 1; i <= this.explosionSize; i++) {
            let leftPos = this.explodingRock - i;
            let rightPos = this.explodingRock + i;

            if (leftPos < 0) {
                leftPos = this.displaySize - 1;
            }
            if (rightPos >= this.displaySize) {
                rightPos = 0;
            }

            display.setPixel(leftPos, explosionColor);
            display.setPixel(rightPos, explosionColor);

            // 检查是否与 gold 重叠
            golds = golds.filter(pos => pos !== leftPos && pos !== rightPos);

            // 检查是否与 playerOne 重叠
            if (playerOne.position === leftPos || playerOne.position === rightPos) {
                controller.endGame();  // 游戏结束，如果 playerOne 碰到爆炸
            }
        }

        // 2秒后结束爆炸
        if (millis() - this.explosionStartTime > 2000) {
            this.isExploding = false;
            this.explodingRock = -1; // 清除正在爆炸的rock
            rocks = rocks.filter(pos => pos !== this.position);  // 移除爆炸的rock
        }
    }

    startExplosion(rockPos) {
        this.explodingRock = rockPos; // 记录要引爆的rock位置
        this.isExploding = true;
        this.explosionStartTime = millis();
        this.explosionSize = 1;  // 初始化爆炸大小
    }
}
