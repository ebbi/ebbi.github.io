class DoWork {
   /* Class to run in a thread 
      Simulate the load by the number of calls to increment */   
   int count;
 
   /* needs to be synchronized and made thread safe
      try compiling both and see the output */
   // public void increment() {
   public synchronized void increment() {
      count++; // count = count + 1
   }
}

public class SyncDemo {
   
   public static void main(String args[]) {
      
      System.out.println("Synchronised value from both Hello and World threads");
      
      DoWork doWork = new DoWork();

      /* annoymous class implementing Runnable interface run() 
         method passed to Runnable */   
      Runnable objHello = new Runnable() {
         
         public void run() {
            
            for(int i=1; i<=1000; i++) {
               doWork.increment();
            }
            
            System.out.println( doWork.count + " Hello ");
  
         }                  
      };
      
      Runnable objWorld = new Runnable() {

         public void run() {
            
            for(int i=1; i<=1000; i++) {
               doWork.increment();
            }
            
            System.out.println( doWork.count + " World ");           
         }                  
      };
      
      Thread threadHello = new Thread(objHello);
      Thread threadWorld = new Thread(objWorld);
      
      threadHello.start();
      threadWorld.start();

      /* .join will force the calling thread to wait until it complete */
      try { threadHello.join(); } catch(Exception e){}
      try { threadWorld.join(); } catch(Exception e){}
      
      System.out.println(doWork.count + " reminders for poetry");
      
   }
}