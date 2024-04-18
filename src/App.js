import React, { useState, useRef, useEffect } from 'react';
import Matter from 'matter-js';
import "./App.css"

const App = () => {
  const [objects, setObjects] = useState([]);
  const [repeatCount, setRepeatCount] = useState(1);
  const canvasRef = useRef(null);
  const engine = useRef(Matter.Engine.create());
  const render = useRef(null);
  const mouseConstraint = useRef(null);

  useEffect(() => {
    const { world } = engine.current;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth / 2;
      canvas.height = innerHeight / 2;
      Matter.Render.setPixelRatio(render.current, 1);
      Matter.Render.lookAt(render.current, {
        min: { x: 0, y: 0 },
        max: { x: innerWidth / 2, y: innerHeight / 2 }
      });
    };

    const setupBoard = () => {
      const canvas = canvasRef.current;
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth / 2;
      canvas.height = innerHeight / 2;

      render.current = Matter.Render.create({
        canvas,
        engine: engine.current,
        options: {
          width: innerWidth / 2,
          height: innerHeight / 2,
          wireframes: false,
          background: '#1F1D1D',
          pixelRatio: 1,
          hasBounds: true
        },
      });

      const walls = Matter.Bodies.rectangle(innerWidth / 4, innerHeight / 2, innerWidth / 2, 50, { isStatic: true });
      Matter.World.add(world, walls);

      mouseConstraint.current = Matter.MouseConstraint.create(engine.current, {
        element: canvas,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

      Matter.World.add(world, mouseConstraint.current);

      Matter.Runner.run(engine.current);
      Matter.Render.run(render.current);

      window.addEventListener('resize', resizeCanvas);

      return () => {
        Matter.Render.stop(render.current);
        Matter.World.clear(world, false);
        Matter.Engine.clear(engine.current);
        window.removeEventListener('resize', resizeCanvas);
      };
    };

    setupBoard();

  }, []);

  const getRandomCoordinates = () => {
    const canvas = canvasRef.current;
    const { width } = canvas.getBoundingClientRect();
    const x = Math.random() * width;
    const y = -50;
    return { x, y };
  };

  const addShape = (shapeType) => {
    const { world } = engine.current;
    for (let i = 0; i < repeatCount; i++) {
      const { x, y } = getRandomCoordinates();
      let shape;
      switch (shapeType) {
        case 'circle':
          shape = Matter.Bodies.circle(x, y, 25, { restitution: 0.8 });
          break;
        case 'square':
          shape = Matter.Bodies.rectangle(x, y, 50, 50, { restitution: 0.8 });
          break;
        case 'rectangle':
          shape = Matter.Bodies.rectangle(x, y, 50, 30, { restitution: 0.8 });
          break;
        case 'triangle':
          shape = Matter.Bodies.polygon(x, y, 3, 30, { restitution: 0.8 });
          break;
        case 'pentagon':
          shape = Matter.Bodies.polygon(x, y, 5, 30, { restitution: 0.8 });
          break;
        case 'hexagon':
          shape = Matter.Bodies.polygon(x, y, 6, 30, { restitution: 0.8 });
          break;
        default:
          return;
      }
      setObjects([...objects, { body: shape }]);
      Matter.World.add(world, shape);
      Matter.Body.setVelocity(shape, { x: 0, y: 3 });
    }
  };

  const clearObjects = () => {
    window.location.reload();
  };

  const handleChangeRepeatCount = (event) => {
    setRepeatCount(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <center>
        <canvas ref={canvasRef} />
        <div>
          <button onClick={() => addShape('circle')}>Add Circle</button>
          <button onClick={() => addShape('square')}>Add Square</button>
          <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
          <button onClick={() => addShape('triangle')}>Add Triangle</button>
          <button onClick={() => addShape('pentagon')}>Add Pentagon</button>
          <button onClick={() => addShape('hexagon')}>Add Hexagon</button>
          <button onClick={clearObjects}>Clear</button>
          <select value={repeatCount} onChange={handleChangeRepeatCount}>
            {[...Array(20)].map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
        </div>
      </center>
    </div>
  );
};

export default App;
