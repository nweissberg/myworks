import { useEffect, useState, Suspense, useRef } from "react";
import Canvas from "../../componets/Canvas";
import { useUtils } from "../utils";

export default function MatrixBackGround(props) {
	const { is_mobile } = useUtils();
	if(is_mobile) return(<div className="absolute flex top-0 left-0 w-full h-full overflow-hidden">
		<img src='image/backgrounds/matrix-code-loop.gif'
			className="bg-center bg-cover h-full w-auto"
			style={{
				position: "absolute",
				zIndex:0,
			}}
		/>
	</div>)
	var particles = [];
	const maxP = 55;
	class particle {
		constructor(ctx) {
		this.change = 0;
		this.speed = Math.random();
		this.ctx = ctx;
		this.pos = { x: Math.random() * this.ctx.canvas.width, y: -20 };
		this.life = 0;
		this.charStr =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghhijklmnopqrstuvwxyz01233456789!#$%¨&*()_+~^[],.<>-=?/|{}";
		this.char = this.charStr.charAt(Math.random() * this.charStr.length);
		}
		draw() {
		this.ctx.fillStyle = "#fff";

		if (this.pos.y > this.ctx.canvas.height) {
			this.pos.y = -20;
			this.char = this.charStr.charAt(Math.random() * this.charStr.length);
			// this.ctx.fillStyle = '#ff0000';
			this.pos.x = Math.random() * this.ctx.canvas.width;
			this.speed = Math.random() * 3 + 1;
		}

		this.change = Math.random() * 10;
		if (this.change > 5) {
			this.pos.y += 20;
			this.char = this.charStr.charAt(Math.random() * this.charStr.length);
		}
		this.ctx.font = `22px thematrix`;
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "top";
		this.ctx.globalCompositeOperation = "source-over";
		this.ctx.fillText(this.char, this.pos.x, this.pos.y);
		}
	}
	var draw = {};

	draw.center = (ctx) => {
		// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.globalCompositeOperation = "multiply";
		ctx.fillStyle = "rgba(0,255,0,0.1)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(0,0,0,0.05)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		if (particles.length < maxP) {
		particles.push(new particle(ctx));
		}
		// tick += clock.getDelta()
		// if(tick < 0.1){
		//   return
		// }
		// tick = 0
		particles.map((p) => {
		p.draw(ctx);
		});
	};
	return (<>
		<Suspense fallback={<></>}>
			
			<Canvas
				{...props}
				style={{
					position: "fixed",
					width: "100%",
					height: "100%",
					top: "0",
					...props.style,
				}}
				// className="hide-on-mobile"
				draw={draw}
			/>
		</Suspense>
	</>);
}
