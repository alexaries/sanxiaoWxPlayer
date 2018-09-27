namespace game {
	/**
	 *
	 * 标签页组
	 * @author iceman
	 *
	 */
	export class DimTabGroup extends eui.Group {
		public static LAYOUT_HORIZONTAL: string = 'horizontal';
		public static LAYOUT_VERTICAL: string = 'vertical';

		private selectItem: eui.Button; //选中的按钮
		private selectIndex: number = 0; //选中序列
		private containerList: Array<egret.DisplayObject>; //容器列表
		private bCreateChildren: boolean = false; //是否加载完毕

		private selectCallFun: Function; //选中回调
		private selectCallFunObj: any; //回调主体
		//private theLockIndex:number=-1;//锁定某个选项
		public constructor() {
			super();
			this.containerList = new Array<egret.DisplayObject>();
		}
		protected createChildren() {
			super.createChildren();
			this.init();
		}
		public init(): void {
			var num: number = this.numChildren;
			var bt: eui.Button;
			for (var i: number = 0; i < num; i++) {
				bt = this.getChildAt(i) as eui.Button;
				bt.name = bt.x + '_' + bt.y;
				if (i == this.selectIndex) {
					this.selectItem = bt;
					bt.enabled = false;
				}
				bt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectBtHandler, this);
			}
			this.selecting(this.selectIndex);
			this.bCreateChildren = true;
		}

		private selectBtHandler(e: egret.TouchEvent): void {
			if (this.selectItem) {
				this.selectItem.enabled = true;
			}
			this.selectItem = e.currentTarget;
			this.selectItem.enabled = false;
			var index: number = this.getChildIndex(this.selectItem);
			this.selecting(index);
			if (this.selectCallFun) {
				//选中回调
				this.selectCallFun.call(this.selectCallFunObj);
			}
		}

		public setSetletctByIndex(index: number): void {
			var num: number = this.numChildren;

			for (var i: number = 0; i < num; i++) {
				let button: eui.Button = this.getChildAt(i) as eui.Button;
				if (i == index) {
					if (this.selectItem) {
						this.selectItem.enabled = true;
					}
					this.selectIndex = index;
					this.selectItem = button;
					this.selectItem.enabled = false;
				}
			}
			this.selecting(this.selectIndex);
		}

		private selecting(_index: number): void {
			if (this.containerList[this.selectIndex]) {
				this.containerList[this.selectIndex].visible = false;
			}
			this.selectIndex = _index;
			if (this.containerList[this.selectIndex]) {
				this.containerList[this.selectIndex].visible = true;
			}
		}

		/**
         *  选中回调
         * @param fun
         */
		public setSelectCallFun(fun: Function, thisObj: any): void {
			this.selectCallFun = fun;
			this.selectCallFunObj = thisObj;
		}
		// //获得选中的对象
		// public lockIndex(_lockindex:number):void{
		//     this.theLockIndex=_lockindex;
		// }
		/**
         * 代码设置选中
         * @param _index
         */
		public setSelect(_index: number): void {
			if (this.bCreateChildren) {
				if (this.selectItem) {
					this.selectItem.enabled = true;
				}
				this.selectItem = this.getChildAt(_index) as eui.Button;
				this.selectItem.enabled = false;
				this.selecting(_index);
			} else {
				this.selectIndex = _index;
			}
		}
		/**
         * 设置选中后 显示的容器
         * @param args
         */
		public setContainer(...args: egret.DisplayObject[]): void {
			for (var i: number = 0; i < args.length; i++) {
				if (this.selectIndex != i) {
					args[i].visible = false;
				} else {
					args[i].visible = true;
				}
				this.containerList.push(args[i]);
			}
		}

		/**
         * 设置开启条件,未开启的标签xy设置为0，0。为了组件可以自适应大小
         * @param layout 布局方式
         * @param args
         */
		public setOpenLv(layout: string, ...args: number[]): void {
			var count: number = 0;
			for (var i: number = 0; i < args.length; i++) {
				var flag: boolean = true; //game.OpenFunctionManager.getInstance().getOpenFunFlag(args[i]);
				this.getChildAt(i).visible = flag;
				if (flag) {
					if (i == count) {
						var xy: string[] = this.getChildAt(i).name.split('_');
						this.getChildAt(i).x = Number(xy[0]);
						this.getChildAt(i).y = Number(xy[1]);
					} else {
						if (layout == game.DimTabGroup.LAYOUT_HORIZONTAL) {
							this.getChildAt(i).x = count * this.getChildAt(i).width * this.getChildAt(i).scaleX;
						} else if (layout == game.DimTabGroup.LAYOUT_VERTICAL) {
							this.getChildAt(i).y = count * this.getChildAt(i).height * this.getChildAt(i).scaleY;
						}
					}
					count++;
				} else {
					this.getChildAt(i).x = 0;
					this.getChildAt(i).y = 0;
				}
			}
		}
		public getCurrentPageIndex(): number {
			return this.selectIndex;
		}
	}

	// if (GameConfig.isMiniGame) {
	// 	window['game']['DimTabGroup'] = game.DimTabGroup;
	// }
}
