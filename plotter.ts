class Plotter{
    plotterState: PlotterState
    drawLine (prt: Printer, 
        from: Position, 
        to: Position, 
        color: LineColor): void{
    prt(`...чертим линию из (${from.x} ${from.y}) в (${to.x}, ${to.y}) используя ${color}цвет`)
}



calcNewPosition (distance: Distance, 
    angle: Angle, 
    current: Position): Position{
    const angle_in_rads = angle * (Math.PI / 180.0) * 1.0;
    const x = current.x + distance * Math.cos(angle_in_rads);
    const y = current.y + distance * Math.sin(angle_in_rads);
    
    const position = { x: Math.round(x), y: Math.round(y)}
    this.plotterState.position = position
    return position
}



 move (prt: Printer, 
    distance: Distance, 
    state: PlotterState): PlotterState {
    let newPosition = this.calcNewPosition(distance, 
        state.angle, 
        state.position);
    if (state.carriageState === CarriageState.DOWN) {
    
    this.drawLine(prt, state.position, newPosition, state.color);
  } else {
    prt(`Передвигаем на ${distance} от точки (${state.position.x}, ${state.position.y})`);
  }
  
  
    const retState = { ...state };
    retState.position = newPosition;
    this.plotterState = retState
    return retState;

}


setPosition (prt: Printer, 
    position: Position, 
    state: PlotterState): PlotterState {
    prt(`Устанавливаем позицию каретки в (${position.x}, ${position.y})`);
  
    const retState = { ...state };
    retState.position = position;
    this.plotterState = retState
    return retState;
}


turn (prt: Printer, 
    angle: Angle, 
    state: PlotterState): PlotterState {
    prt(`Поворачиваем на ${angle} градусов`);
  
    const newAngle = (state.angle + angle) % 360.0;
  
    const retState = { ...state };
    retState.angle = newAngle;
    this.plotterState = retState
    return retState;
}


carriageUp (prt: Printer, 
    state: PlotterState): PlotterState {
    prt("Поднимаем каретку");
    
    const retState = { ...state };
    retState.carriageState = CarriageState.UP;
    this.plotterState = retState
    return retState;
}


carriageDown (prt: Printer, 
    state: PlotterState): PlotterState {
    prt("Опускаем каретку");
  
    const retState = { ...state };
    retState.carriageState = CarriageState.DOWN;
    this.plotterState = retState
    return retState;
}


setColor (prt: Printer, 
    color: LineColor, 
    state: PlotterState): PlotterState {
    prt(`Устанавливаем ${color} цвет`);
  
    const retState = { ...state };
    retState.color = color;
    this.plotterState = retState
    return retState;
}


drawSquare (prt: Printer, 
    size: number, 
    state: PlotterState): PlotterState {
    state = this.carriageDown(prt, state);

    for(let i=0; i<4; ++i){
    state = this.move(prt, size, state);
    state = this.turn(prt, 90.0, state);
        }  
    return this.carriageUp(prt, state);
}


 drawTriangle (prt: Printer, 
    size: number, 
    state: PlotterState): PlotterState {
    state = this.carriageDown(prt, state);

    for(let i=0; i<3; ++i){
    state = this.move(prt, size, state);
    state = this.turn(prt, 120.0, state);
    }
    return this.carriageUp(prt, state); 
}
}


class LogToConsole {
    log(message: string):void{

    }
}

interface logger{
    log(message: string): void;
}


type Point = number;
type Distance = number;
type Angle = number;
type Position = { x: Point; y: Point };

enum CarriageState {
  UP,
  DOWN
}

enum LineColor {
  PINK = "розовый",
  YELLOW = "жёлтый",
  RED = "красный"
}

type PlotterState = {
  position: Position;
  angle: Angle;
  color: LineColor;
  carriageState: CarriageState;
};

type Printer = (s: string) => void;

const printer: Printer = console.log;

function initPlotterState(position: Position, 
    angle: Angle, 
    color: LineColor, 
    carriageState: CarriageState): PlotterState {
    return {
    position: position,
    angle: angle,
    color: color,
    carriageState: carriageState
  };
}


let initPosition: Position = { x: 0.0, y: 0.0 };
let initColor: LineColor = LineColor.RED;
let initAngle: Angle = 0.0;
let initCarriageState: CarriageState = CarriageState.UP;

let plotterState = initPlotterState(initPosition, initAngle, initColor, initCarriageState);


let plotter: Plotter = new Plotter()

plotter.drawTriangle(printer, 150.0, plotterState);

plotter.setPosition(printer, { x: 15.0, y: 15.0 }, plotterState);
plotter.setColor(printer, LineColor.BLUE, plotterState);
plotter.drawSquare(printer, 90.0, plotterState);