import { Shape } from './shape.model';
import { Point } from './point.model';
import { Instance } from './instance.model';

export class Canvas extends Shape {

    constructor(width: number, height: number) {
        super(null, null, width, height);
        this.setShadowColor('black');
        this.setShadowBlur(5);
        this.setColor('white');
    }

    render(instance: Instance): void {
        instance.ctx.beginPath();
        instance.ctx.translate(
            instance.startPoint.x + (this.getWidth() / 2) * -1,
            instance.startPoint.y + (this.getHeight() / 2) * -1
        );
        // Shadow
        instance.ctx.shadowColor = this.getShadowColor();
        instance.ctx.shadowBlur = this.getShadowBlur();
        // Rectangle
        instance.ctx.fillStyle = this.getColor();

        instance.ctx.fillRect(
            instance.startPoint.x + instance.canvasContainer.offsetWidth / 2,
            instance.startPoint.y + instance.canvasContainer.offsetHeight / 2,
            this.getWidth() * instance.zoom,
            this.getHeight() * instance.zoom
        );

        instance.ctx.stroke();
        instance.ctx.translate((this.getWidth() / 2), (this.getHeight() / 2));
    }

    private drawCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        ctx.fillRect(this.getStartX() + x, this.getStartY() + y, width * this.getZoom(), height * this.getZoom());
    }
}
