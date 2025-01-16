import Todos from "../islands/Todos.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-slate-50">
      <div class="max-w-screen-sm mx-auto flex flex-col items-center justify-center">
        <h2 class="text-3xl">Todos</h2>
        <Todos />
      </div>
    </div>
  );
}
