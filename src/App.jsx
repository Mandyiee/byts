import { useEffect, useState, useRef } from 'react'
import Upload from './components/Upload'
import './App.css'
import Navbar from './components/Navbar'
import Config from './components/Config';
import Output from './components/Output';

//upload file
//update configurations 
//update preview
//create simulation

//the canvas has to be in the webworker because i need it for resizing

//there has to be an image file for preview


function App() {
  const [images, setImages] = useState([]);

  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);
  
  
  const MAX_WORKERS = 4;
  const workerPool = useRef([]);
  const taskQueue = useRef([]);
  const activeWorkers = useRef(0);
  
  useEffect(() => {
    console.log("Initializing workers");
    // Clear previous worker pool if it exists
    workerPool.current.forEach(worker => worker.terminate());
    workerPool.current = [];
    
    // Create new workers
    for (let i = 0; i < MAX_WORKERS; i++) {
      try {
        // Use absolute path from the root or correct relative path
        const worker = new Worker(new URL('./workers/processing.js', import.meta.url));
        worker.onmessage = handleWorkerMessage;
        worker.onerror = (err) => console.error(`Worker error: ${err.message}`);
        worker.idle = true;
        worker.id = i; // Add an ID to make worker identification easier
        workerPool.current.push(worker);
        console.log(`Worker ${i} initialized`);
      } catch (err) {
        console.error(`Failed to create worker: ${err.message}`);
      }
    }
    
    return () => {
      console.log("Terminating workers");
      workerPool.current.forEach(worker => worker.terminate());
    };
  }, []);
  
  
  const processNextTask = () => {
    console.log("Processing next task, queue length:", taskQueue.current.length);
    
    if (taskQueue.current.length === 0) {
      if (activeWorkers.current === 0) {
        console.log("All tasks completed");
        setProcessing(false);
        setReady(true);
      }
      return;
    }
    
    const idleWorker = workerPool.current.find(worker => worker.idle);
    if (!idleWorker) {
      console.log("No idle workers available");
      return;
    }
    
    const task = taskQueue.current.shift();
    idleWorker.idle = false;
    activeWorkers.current++;
    
    console.log(`Assigning task ${task.name} to worker ${idleWorker.id}`);
    createCodeOutput(task, idleWorker);
  };
  
  const createCodeOutput = (task, worker) => {
    worker.postMessage({
      task
    });
  };
  
  const handleImagesInput = (images) => {
    if (!images || images.length === 0) return;
    console.log(`Processing ${images.length} images`);
    console.log(images)
    console.log(`Processing ${images.length} images`);
    setProcessing(true);
    setReady(false);
    setCode("");
    setResults([]);
    
    
    // Create new tasks
    taskQueue.current.push(...Array.from(images).map((image, index) => ({
      image, 
    })));
    console.log(taskQueue.current);
    
    // Start processing tasks
    const tasksToStart = Math.min(MAX_WORKERS, taskQueue.current.length);
    console.log(`Starting ${tasksToStart} initial tasks`);
    
    for (let i = 0; i < tasksToStart; i++) {
      processNextTask();
    }
  };
  
  const handleWorkerMessage = (e) => {
    const { type, name, encoding, width, height, data, error } = e.data;

     if (type === 'complete') {
      console.log(`Task completed: ${name}`);
      
      const newResult = {
        name, encoding, width, height
      }

      setResults(prev => ([...prev , newResult]))
      
      setCode(prev => prev + (prev ? '\n' : '') + data);
      
      // Find the worker that sent this message
      const worker = workerPool.current.find(w => w === e.target);
      if (worker) {
        worker.idle = true;
        activeWorkers.current--;
        console.log(`Worker ${worker.id} is now idle, active workers: ${activeWorkers.current}`);
        
        // Process next task
        processNextTask();
      } else {
        console.log(`Could not find worker that completed the task`);
      }
    } else {
      console.log(`${error}`);
    }
  };
  
  return (
    <div className='bg-[var(--color-section-highlight)] grid-background'>
    <Navbar />
    <div className=''>
      
      <div className=' w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-10'>
        <Upload setImages={setImages} images={images}/>
        <Config images={images} handleImagesInput={handleImagesInput} setImages={setImages} processing={processing} />
        <Output code={code} ready={ready} results={results}/>
        
      
     
      </div>
    </div>
    </div>
  );
}

export default App;

// {processing && (
//   <div className="text-sm text-gray-500">
//     Processing: {taskQueue.current.length} tasks remaining, 
//     {activeWorkers.current} workers active
//   </div>
// )}

 