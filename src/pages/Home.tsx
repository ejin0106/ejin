import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { generatePackData } from '../services/gemini';
import { Plus, BookOpen, Loader2, Trash2 } from 'lucide-react';

export const Home: React.FC = () => {
  const { packs, addPack, deletePack } = useAppContext();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !text.trim()) return;
    setLoading(true);
    try {
      const words = await generatePackData(text);
      if (words.length > 0) {
        addPack(title, words);
        setIsCreating(false);
        setTitle('');
        setText('');
      } else {
        alert('未能解析出生字词，请检查输入内容。');
      }
    } catch (e) {
      alert('生成失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            语文生字词默写
          </h1>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            新建词卡包
          </button>
        </div>

        {isCreating && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">创建新词卡包</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">词卡包名称 (如: 第六课 散步)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="输入名称..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">导入生字词 (以空格或逗号分隔)</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  placeholder="例如: 测试 苹果 葡萄 散步..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !title.trim() || !text.trim()}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '生成词卡包'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.length === 0 && !isCreating ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              还没有词卡包，点击右上角新建一个吧！
            </div>
          ) : (
            packs.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer"
                onClick={() => navigate(`/pack/${pack.id}`)}
              >
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pack.title}</h3>
                  <p className="text-gray-500 text-sm">共 {pack.words.length} 个字词</p>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(pack.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定要删除这个词卡包吗？')) {
                        deletePack(pack.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
