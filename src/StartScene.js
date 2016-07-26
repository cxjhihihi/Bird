var StartLayer = cc.Layer.extend({
	get_start_png:null,
	start_click:null,
	menu:null,
	size:null,
	count:null,
	pipeSprites:null,
	bg_s:null,
	start_bird:null,
	touchListener:null,
	ctor:function () {
		this.pipeSprites=[];
		this.bg_s=[];
		cc.spriteFrameCache.addSpriteFrames(res.Flappy_packer_list);
		this._super();
		size = cc.winSize;
		this.add_start_bg();
		this.count=1;
		var frame = cc.spriteFrameCache.getSpriteFrame("getready.png");
		get_start_png = new cc.Sprite(frame);
		get_start_png.attr({
			x:size.width / 2,
			y:size.height-200,
		});
		this.addChild(get_start_png,1);
		frame = cc.spriteFrameCache.getSpriteFrame("click.png");
		start_click = new cc.MenuItemImage(
			frame,frame,
			function(){
				this.remove_start_png();
				this.schedule(this.add_s_bg,4,317979,0.2);
				this.schedule(this.bird_down,0.5,317979,0.2);
				this.schedule(this.is_hack,0.2,1909090898,0.2);
				this.addTouchEventListenser();
			},this);
		start_click.attr({
			x:size.width / 2,
			y:size.height/2,
			anchorX: 0.5,
			anchorY: 0.5
		});
		menu = new cc.Menu(start_click);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);
		frame =cc.spriteFrameCache.getSpriteFrame("bird1.png");
		this.start_bird=new cc.Sprite(frame);
		this.start_bird.attr({
			x:size.width/2-100,
			y:size.height/2,
			
		});
		this.addChild(this.start_bird,1);
		return true;
	},
	remove_start_png:function(){
		this.removeChild(menu, 0);
		this.removeChild(get_start_png, 0);
	},
	add_s_bg:function(){
		if(this.count==1){
			var bgSprite = new BgSprite(res.Bg);
			bgSprite.attr({
				x: size.width / 2,
				y: size.height / 2,
			});
			bgSprite.index=this.bg_s.length;
			this.bg_s.push(bgSprite);
			this.addChild(bgSprite, 0);
			var runAction = cc.MoveTo.create(4,cc.p(bgSprite.x-bgSprite.width,bgSprite.y));
			bgSprite.runAction(runAction);
			var bgSprite2 = new BgSprite(res.Bg);

			bgSprite2.attr({
				x: bgSprite2.width+size.width / 2,
				y:size.height / 2,
			});
			bgSprite2.index=this.bg_s.length;
			this.bg_s.push(bgSprite2);
			this.addChild(bgSprite2, 0);
			var runAction2 = cc.MoveTo.create(8,cc.p(bgSprite2.x-2*bgSprite2.width,bgSprite2.y));
			bgSprite2.runAction(runAction2);
			var frame =cc.spriteFrameCache.getSpriteFrame("holdback2.png");
			var pipe = new cc.Sprite(frame);
			pipe.attr({
				x:bgSprite2.x-size.width/2*cc.random0To1(),
				y:size.height-pipe.height*(0.5*cc.random0To1()),
			});
			this.pipeSprites.push(pipe);
			pipe.index=this.pipeSprites.length;
			this.addChild(pipe, 0);
			var pipeAction2 = cc.MoveTo.create(8,cc.p(pipe.x-2*bgSprite2.width,pipe.y));
			pipe.runAction(pipeAction2);
			this.count++;
		}else{
			var frame=null;
			var yy=null;
			var pipe=null;
			if(this.count%2==0){
				frame =cc.spriteFrameCache.getSpriteFrame("holdback1.png");
				pipe = new cc.Sprite(frame);
				yy=0+pipe.height*(0.5*cc.random0To1());
			}else{
				frame =cc.spriteFrameCache.getSpriteFrame("holdback2.png");
				pipe = new cc.Sprite(frame);
				yy=size.height-pipe.height*(0.5*cc.random0To1());
			}
			var bgSprite2 = new BgSprite(res.Bg);
			bgSprite2.attr({
				x: bgSprite2.width+size.width / 2,
				y:size.height / 2,
			});
			bgSprite2.index=this.bg_s.length;
			this.bg_s.push(bgSprite2);
			this.addChild(bgSprite2, 0);
			var runAction2 = cc.MoveTo.create(8,cc.p(bgSprite2.x-2*bgSprite2.width,bgSprite2.y));
			bgSprite2.runAction(runAction2);
			pipe.attr({
				x:bgSprite2.x-size.width/2*cc.random0To1(),
				y:yy,
			});
			this.pipeSprites.push(pipe);
			pipe.index=this.pipeSprites.length;
			this.addChild(pipe, 0);
			var pipeAction2 = cc.MoveTo.create(8,cc.p(pipe.x-2*bgSprite2.width,pipe.y));
			pipe.runAction(pipeAction2);
			this.count++;
		}
	},
	is_hack:function(){
		var bird_up_y=this.start_bird.y+this.start_bird.height/2;
		var bird_right_x=this.start_bird.x+this.start_bird.width/2;
		var bird_bottom_y=this.start_bird.y-this.start_bird.height/2;;
		for(var i=0;i<this.pipeSprites.length;i++){
			
			var pipe_bottom_x=this.pipeSprites[i].x-this.pipeSprites[i].width/2;
			var pipe_top_x=this.pipeSprites[i].x+this.pipeSprites[i].width/2;;
			var pipe_bottom_y=this.pipeSprites[i].y-this.pipeSprites[i].height/2;
			var pipe_top_y=this.pipeSprites[i].y+this.pipeSprites[i].height/2;
			if(this.start_bird.x>=pipe_bottom_x&&this.start_bird.x<=pipe_top_x){
				if(bird_up_y>=pipe_bottom_y&&bird_up_y<=pipe_top_y){
					this.game_over();
					break;
				}
				if(bird_bottom_y>=pipe_bottom_y&&bird_bottom_y<=pipe_top_y){
					this.game_over();
					break;
				}
			}
			if(bird_right_x>=pipe_bottom_x&&bird_right_x<=pipe_top_x){
				if(this.start_bird.y>=pipe_bottom_y&&this.start_bird.y<=pipe_top_y){
					this.game_over();
					break;
				}
			}
		}
	},
	game_over:function(){
		this.unschedule(this.add_s_bg);
		var frame =cc.spriteFrameCache.getSpriteFrame("gameover.png");
		var gameover =new cc.Sprite(frame);
		gameover.attr({
			x:size.width / 2,
			y:size.height / 2,
		});
		this.addChild(gameover,1);
		this.start_bird.stopAllActions();
		var bird_down_a = cc.MoveTo.create(1,cc.p(this.start_bird.x-120,-40));
		this.start_bird.runAction(bird_down_a);
		this.removeTouchEventListenser();
		this.scheduleOnce(cc.director.pause, 1);
	},
	add_start_bg:function(){
		var bgSprite = new BgSprite(res.Bg);
		bgSprite.attr({
			x:size.width / 2,
			y:size.height / 2,
		});
		this.addChild(bgSprite, 0);
	},
	bird_down:function(){
		var bird_down_a = cc.MoveTo.create(0.5,cc.p(this.start_bird.x,this.start_bird.y-120));
		this.start_bird.runAction(bird_down_a);
	},
	bird_up:function(){
		this.start_bird.stopAllActions();
		var bird_up_a = cc.MoveTo.create(0.1,cc.p(this.start_bird.x,this.start_bird.y+60));
		this.start_bird.runAction(bird_up_a);
	},
	addTouchEventListenser:function(){
		//touch event
		this.touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) { 
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				target.bird_up();
				return true;
			}
		});

		cc.eventManager.addListener(this.touchListener,this);
	},
	removeTouchEventListenser:function(){
		cc.eventManager.removeListener(this.touchListener);
	}
});

var StartScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new StartLayer();
		this.addChild(layer);
	}
});