import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./index.css";

interface Event {
  id: string;
  title: string;
  targetDate: string;
  color: string;
  isFeatured: boolean;
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [unit, setUnit] = useState<"day" | "hour" | "minute">("day");

  // 加载数据
  useEffect(() => {
    const saved = localStorage.getItem("events");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  // 保存数据
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!title || !date) return;
    setEvents([
      { id: Date.now().toString(), title, targetDate: date, color, isFeatured: false },
      ...events,
    ]);
    setTitle("");
    setDate("");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const toggleFeature = (id: string) => {
    setEvents(
      events.map((e) => ({
        ...e,
        isFeatured: e.id === id ? !e.isFeatured : false,
      }))
    );
  };

  const getCountdown = (targetDate: string) => {
    const target = dayjs(targetDate);
    const now = dayjs();
    const diff = target.diff(now, unit as any, true);
    const value = Math.max(0, Math.round(diff * 10) / 10);
    const unitText = unit === "day" ? "天" : unit === "hour" ? "小时" : "分钟";
    return { value, unitText };
  };

  const colors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#3b82f6", "#a855f7", "#ec4899", "#64748b",
  ];

  const featured = events.find((e) => e.isFeatured);
  const others = events.filter((e) => !e.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <div className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">🎯 倒计时</h1>
          <div className="flex gap-2 mb-4">
            {["day", "hour", "minute"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u as any)}
                className={`px-4 py-2 rounded font-semibold ${
                  unit === u
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {u === "day" ? "天" : u === "hour" ? "小时" : "分钟"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主容器 */}
      <div className="max-w-6xl mx-auto p-6">
        {/* 添加表单 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">➕ 新增活动</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="活动名称"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border rounded"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border rounded"
            />
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded border-2 ${
                    color === c ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <button
              onClick={addEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
            >
              创建
            </button>
          </div>
        </div>

        {/* 置顶活动 */}
        {featured && (
          <div
            className="rounded-lg shadow-lg p-8 mb-8 text-white"
            style={{ backgroundColor: featured.color }}
          >
            <h3 className="text-3xl font-bold mb-2">{featured.title}</h3>
            <div className="text-6xl font-bold mb-4">
              {getCountdown(featured.targetDate).value}
              <span className="text-3xl ml-2">{getCountdown(featured.targetDate).unitText}</span>
            </div>
            <p className="text-lg mb-6">
              {dayjs(featured.targetDate).format("YYYY 年 M 月 D 日")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFeature(featured.id)}
                className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded"
              >
                取消置顶
              </button>
              <button
                onClick={() => deleteEvent(featured.id)}
                className="px-4 py-2 bg-red-500/50 hover:bg-red-600/60 rounded"
              >
                删除
              </button>
            </div>
          </div>
        )}

        {/* 其他活动 */}
        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">😴</div>
            <p className="text-xl text-gray-600">还没有活动哦，点击上面"新增"来添加吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((event) => (
              <div
                key={event.id}
                className="rounded-lg shadow p-6 text-white group hover:shadow-lg transition"
                style={{ backgroundColor: event.color }}
              >
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <div className="text-4xl font-bold mb-2">
                  {getCountdown(event.targetDate).value}
                  <span className="text-xl ml-2">{getCountdown(event.targetDate).unitText}</span>
                </div>
                <p className="text-sm mb-4 opacity-80">
                  {dayjs(event.targetDate).format("YYYY-MM-DD")}
                </p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => toggleFeature(event.id)}
                    className="flex-1 px-3 py-2 bg-white/30 hover:bg-white/40 rounded text-sm"
                  >
                    📌 置顶
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="flex-1 px-3 py-2 bg-red-500/50 hover:bg-red-600/60 rounded text-sm"
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
