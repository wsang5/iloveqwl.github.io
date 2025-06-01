let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");
let bgMusic = document.getElementById("bgMusic");
let musicToggle = document.getElementById("musicToggle");
let isMusicPlaying = false;

// 加载后尝试播放音乐
document.addEventListener('DOMContentLoaded', function() {
  // 由于浏览器限制，可能需要用户交互才能播放音频
  // 先尝试播放
  playBackgroundMusic();
});

// 更新音乐控制按钮状态的函数
function updateMusicButtonState() {
  const icon = musicToggle.querySelector("i");
  if (isMusicPlaying) {
    icon.className = "fas fa-music"; // 播放中图标
  } else {
    icon.className = "fas fa-volume-mute"; // 静音图标
  }
}

// 播放背景音乐的函数
function playBackgroundMusic() {
  // 如果音乐已经在播放，不要重新开始
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 0.5;
    
    // 添加用户交互检测
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        updateMusicButtonState();
      }).catch(e => {
        console.log('音频自动播放失败，可能需要用户交互:', e);
        
        // 添加一个一次性点击事件监听器来播放音频
        const playOnInteraction = function() {
          bgMusic.play()
            .then(() => {
              isMusicPlaying = true;
              updateMusicButtonState();
            })
            .catch(err => console.log('即使在交互后播放失败:', err));
          
          // 移除事件监听器
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        
        // 添加事件监听器
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
        
        // 显示提示
        const audioPrompt = document.createElement('div');
        audioPrompt.style.position = 'fixed';
        audioPrompt.style.bottom = '20px';
        audioPrompt.style.left = '50%';
        audioPrompt.style.transform = 'translateX(-50%)';
        audioPrompt.style.background = 'rgba(0,0,0,0.7)';
        audioPrompt.style.color = 'white';
        audioPrompt.style.padding = '10px 20px';
        audioPrompt.style.borderRadius = '20px';
        audioPrompt.style.fontSize = '14px';
        audioPrompt.style.zIndex = '9999';
        audioPrompt.textContent = '点击页面任意位置播放音乐';
        audioPrompt.style.opacity = '0';
        audioPrompt.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(audioPrompt);
        
        // 淡入提示
        setTimeout(() => {
          audioPrompt.style.opacity = '1';
          
          // 5秒后淡出提示
          setTimeout(() => {
            audioPrompt.style.opacity = '0';
            setTimeout(() => {
              if (audioPrompt.parentNode) {
                audioPrompt.parentNode.removeChild(audioPrompt);
              }
            }, 500);
          }, 5000);
        }, 100);
      });
    }
  }
}

// 暂停背景音乐的函数
function pauseBackgroundMusic() {
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicButtonState();
  }
}

// 切换音乐播放状态的函数
function toggleMusic() {
  if (bgMusic) {
    if (bgMusic.paused) {
      playBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  }
}

// 音乐控制按钮点击事件
musicToggle.addEventListener('click', function(e) {
  e.stopPropagation(); // 阻止事件冒泡
  toggleMusic();
});

// 用户首次点击页面时播放音乐（排除音乐控制按钮的点击）
document.addEventListener('click', function(e) {
  // 确保点击不是在音乐控制按钮上
  if (!musicToggle.contains(e.target)) {
    playBackgroundMusic();
  }
}, { once: true });

const params = new URLSearchParams(window.location.search);
let username = params.get("name");

// 限制用户名长度，避免页面样式崩坏
const maxLength = 20;
const safeUsername = username ? username.substring(0, maxLength) : "???";

// 防止 `null` 变成 `"null"`
if (username) {
  questionText.innerText = questionText.innerText + safeUsername;
}

let clickCount = 0; // 记录点击 No 的次数

// No 按钮的文字变化
const noTexts = [
  "？你认真的吗…",
  "要不再想想？",
  "不许选这个！ ",
  "我会很伤心…",
  "不行:(",
];

// 心形坐标生成函数
function heartShape(t, size) {
  t *= 2 * Math.PI;
  const x = size * 16 * Math.pow(Math.sin(t), 3);
  const y = size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x, y: y };
}

// 修改颜色数组，使用标准彩虹顺序，从红到紫
const colors = [
  0xFF0000, // 红色
  0xFF7F00, // 橙色
  0xFFFF00, // 黄色
  0x00FF00, // 绿色
  0x0000FF, // 蓝色
  0x4B0082, // 靛色
  0x9400D3  // 紫色
];

// No 按钮点击事件
noButton.addEventListener("click", function () {
  // 确保音乐正在播放
  playBackgroundMusic();
  
  clickCount++;

  // 让 Yes 变大，每次放大 2 倍
  let yesSize = 1 + clickCount * 1.2;
  yesButton.style.transform = `scale(${yesSize})`;

  // 挤压 No 按钮，每次右移 50px
  let noOffset = clickCount * 50;
  noButton.style.transform = `translateX(${noOffset}px)`;

  // 让图片和文字往上移动
  let moveUp = clickCount * 25;
  mainImage.style.transform = `translateY(-${moveUp}px)`;
  questionText.style.transform = `translateY(-${moveUp}px)`;

  // No 文案变化（前 5 次变化）
  if (clickCount <= 5) {
    noButton.innerText = noTexts[clickCount - 1];
  }

  // 图片变化（前 5 次变化）- 都使用image.png
  if (clickCount === 1) mainImage.src = "images/image.png"; // 使用现有图片
  if (clickCount === 2) mainImage.src = "images/image.png"; // 使用现有图片
  if (clickCount === 3) mainImage.src = "images/image.png"; // 使用现有图片
  if (clickCount === 4) mainImage.src = "images/image.png"; // 使用现有图片
  if (clickCount >= 5) mainImage.src = "images/image.png"; // 使用现有图片
});

// Yes 按钮点击后，进入表白成功页面
const loveTest = `秦婉琳小朋友 儿童节快乐🎉  ${
  username ? `${safeUsername}  ♡︎ᐝ(>᎑< )` : ""
}`;

// 情书内容 - 完整版
const letterContent = `
  <div class="letter-title" style="font-size: 0.9em; margin-bottom: 5px;">❤️ 儿童节快乐 ❤️</div>
  <div class="letter-content" style="line-height: 1;">
   <p style="font-size: 0.7em; margin-bottom: 2px;">亲爱的秦婉琳：</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">亲爱的秦婉琳：</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">亲爱的秦婉琳小朋友：</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">即使成了全世界的大人，</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">依然希望你永远是我可爱的宝宝！</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">愿你永远保持童真，</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">天天快乐 健康 平安！</p>
    <p style="font-size: 0.7em; margin-bottom: 2px;">儿童节快乐，亲爱的琳宝！</p> 
  </div>
  <div class="letter-footer" style="font-size: 0.8em; margin-top: 10px; margin-bottom: 30px;">永远爱你的王俊彦</div>
`;

yesButton.addEventListener("click", function () {
  // 保存当前的音频状态
  const wasPlaying = bgMusic && !bgMusic.paused;
  const currentTime = bgMusic ? bgMusic.currentTime : 0;
  const currentVolume = bgMusic ? bgMusic.volume : 0.5;
  
  // 先创建基础 HTML 结构，保留音乐控制按钮
  document.body.innerHTML = `
        <div class="yes-screen">
            <h1 class="yes-text"></h1>
            <div id="heartCanvas" class="heart-canvas"></div>
            <div class="music-control" id="musicToggle">
                <i class="${wasPlaying ? 'fas fa-music' : 'fas fa-volume-mute'}"></i>
            </div>
            <audio id="bgMusic" loop>
                <source src="music/background.mp3" type="audio/mp3">
            </audio>
            
            <!-- 信封容器 -->
            <div class="envelope-container" id="envelopeContainer">
                <!-- 装饰球 -->
                <div class="decoration"></div>
                <div class="decoration"></div>
                <div class="decoration"></div>
                <div class="decoration"></div>
                
                <div class="envelope" id="envelope">
                    <!-- 信封主体 -->
                    <div class="envelope-body"></div>
                    <!-- X对角线设计 -->
                    <div class="envelope-top"></div>
                    <div class="envelope-bottom"></div>
                    <div class="envelope-left"></div>
                    <div class="envelope-right"></div>
                    <!-- 中心区域和按钮 - 使用爱心形状替代圆形 -->
                    <div class="envelope-center" style="background-color: transparent; box-shadow: none; border: none; width: auto; height: auto;">
                        <button class="open-button" id="openButton" style="position: relative; width: 400px; height: 200px; background: transparent; border: none; cursor: pointer; transition: all 0.3s ease; display: flex; justify-content: center; align-items: center; box-shadow: none; padding: 0;">
                          <!-- 创建爱心形状的背景 -->
                          <div style="position: absolute; width: 160px; height: 140px; top: 30px; left: 50%; transform: translateX(-50%); 
                               clip-path: path('M80,20 C80,20 0,-20 0,60 C0,120 80,140 80,140 C80,140 160,120 160,60 C160,-20 80,20 80,20 Z');
                               background: linear-gradient(135deg, #ff7eb9, #ff65a3);
                               box-shadow: 0 5px 25px rgba(255, 105, 180, 0.6);">
                               
                               <!-- 将文字直接放在爱心内部居中位置 -->
                               <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                                 <span style="color: white; font-weight: bold; font-size: 1.8em; letter-spacing: 3px; text-shadow: 1px 1px 3px rgba(0,0,0,0.2);">开</span>
                               </div>
                          </div>
                          
                          <!-- 内层容器 - 保留但不显示内容，以保持现有代码结构 -->
                          <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; width: 100%;">
                              
                              <!-- 文字已移至爱心内部 -->
                              <div style="display: none;">
                                <span></span>
                              </div>
                          </div>
                        </button>
                    </div>
                    <!-- 信纸 -->
                    <div class="letter" id="letter">
                        ${letterContent}
                    </div>
                </div>
            </div>
        </div>
    `;

  // 重新获取音频和控制元素
  bgMusic = document.getElementById("bgMusic");
  musicToggle = document.getElementById("musicToggle");
  
  // 设置音频元素的状态
  if (bgMusic) {
    bgMusic.volume = currentVolume;
    bgMusic.currentTime = currentTime;
    
    // 如果之前音乐在播放，继续播放
    if (wasPlaying) {
      isMusicPlaying = true;
      bgMusic.play().catch(e => console.log('切换场景后音频播放失败:', e));
    } else {
      isMusicPlaying = false;
    }
  }
  
  // 重新绑定音乐控制按钮事件
  if (musicToggle) {
    updateMusicButtonState();
    musicToggle.addEventListener('click', toggleMusic);
  }

  // 确保用户名安全地插入
  document.querySelector(".yes-text").innerText = loveTest;

  // 禁止滚动，保持页面美观
  document.body.style.overflow = "hidden";
  
  // 显示3D爱心效果
  startHeartAnimation();
  
  // 10秒后显示信封
  setTimeout(showEnvelope, 10000);
});

// 显示信封
function showEnvelope() {
  const envelopeContainer = document.getElementById('envelopeContainer');
  const envelope = document.getElementById('envelope');
  const openButton = document.getElementById('openButton');
  const letter = document.getElementById('letter');
  
  if (envelopeContainer) {
    // 显示信封容器
    envelopeContainer.classList.add('show');
    
    // 添加心形按钮脉动动画
    let pulseAnimation;
    function startPulseAnimation() {
      let scale = 1;
      let growing = true;
      pulseAnimation = setInterval(() => {
        if (growing) {
          scale += 0.01;
          if (scale >= 1.08) growing = false;
        } else {
          scale -= 0.01;
          if (scale <= 1) growing = true;
        }
        
        // 获取爱心元素
        const heartElement = openButton.querySelector('div');
        const textElement = heartElement ? heartElement.querySelector('div') : null;
        
        if (heartElement) {
          // 应用脉动效果到爱心
          heartElement.style.transform = `translateX(-50%) scale(${scale})`;
          
          // 调整阴影，增强跳动感
          const shadowBlur = 5 + scale * 5;
          heartElement.style.boxShadow = `0 ${shadowBlur}px 25px rgba(255, 105, 180, ${0.5 + (scale-1)*2})`;
          
          // 文字随爱心一起跳动
          if (textElement) {
            textElement.style.transform = `translate(-50%, -50%) scale(${1 + (scale-1)*0.5})`;
          }
        } else {
          // 如果找不到爱心，应用到整个按钮
          openButton.style.transform = `scale(${scale})`;
        }
      }, 50);
    }
    
    function stopPulseAnimation() {
      clearInterval(pulseAnimation);
      
      // 重置爱心样式
      const heartElement = openButton.querySelector('div');
      const textElement = heartElement ? heartElement.querySelector('div') : null;
      
      if (heartElement) {
        heartElement.style.transform = 'translateX(-50%)';
        heartElement.style.boxShadow = '0 5px 25px rgba(255, 105, 180, 0.6)';
        
        if (textElement) {
          textElement.style.transform = 'translate(-50%, -50%)';
        }
      } else {
        openButton.style.transform = 'scale(1)';
      }
    }
    
    // 启动脉动动画
    startPulseAnimation();
    
    // 添加心形按钮悬停效果
    openButton.addEventListener('mouseover', function() {
      stopPulseAnimation();
      
      // 获取爱心元素
      const heartElement = this.querySelector('div');
      const textElement = heartElement ? heartElement.querySelector('div') : null;
      
      if (heartElement) {
        // 放大爱心
        heartElement.style.transform = 'translateX(-50%) scale(1.05)';
        heartElement.style.boxShadow = '0 8px 30px rgba(255, 105, 180, 0.7)';
        
        // 更改爱心背景
        heartElement.style.background = 'linear-gradient(135deg, #ff65a3, #ff3d7f)';
        
        // 文字效果
        if (textElement) {
          textElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
          const textSpan = textElement.querySelector('span');
          if (textSpan) {
            textSpan.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
          }
        }
      }
    });
    
    openButton.addEventListener('mouseout', function() {
      // 获取爱心元素
      const heartElement = this.querySelector('div');
      const textElement = heartElement ? heartElement.querySelector('div') : null;
      
      if (heartElement) {
        // 重置爱心样式
        heartElement.style.transform = 'translateX(-50%)';
        heartElement.style.boxShadow = '0 5px 25px rgba(255, 105, 180, 0.6)';
        heartElement.style.background = 'linear-gradient(135deg, #ff7eb9, #ff65a3)';
        
        // 重置文字样式
        if (textElement) {
          textElement.style.transform = 'translate(-50%, -50%)';
          const textSpan = textElement.querySelector('span');
          if (textSpan) {
            textSpan.style.textShadow = '1px 1px 3px rgba(0,0,0,0.2)';
          }
        }
      }
      
      startPulseAnimation();
    });
    
    // 绑定拆开按钮事件
    openButton.addEventListener('click', function() {
      // 点击时的动画
      stopPulseAnimation();
      
      // 获取爱心元素
      const heartElement = this.querySelector('div');
      const textElement = heartElement ? heartElement.querySelector('div') : null;
      
      if (heartElement) {
        // 爱心变换效果
        heartElement.style.transform = 'translateX(-50%) scale(1.15)';
        heartElement.style.boxShadow = '0 10px 35px rgba(255, 105, 180, 0.8)';
        heartElement.style.background = 'linear-gradient(135deg, #ff3d7f, #ff1a57)';
        
        // 文字效果
        if (textElement) {
          textElement.style.transform = 'translate(-50%, -50%) scale(1.2)';
          const textSpan = textElement.querySelector('span');
          if (textSpan) {
            textSpan.style.color = 'white';
            textSpan.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.9)';
          }
        }
      }
      
      setTimeout(() => {
        envelope.classList.add('open');
        
        // 添加烟花庆祝效果
        createFireworks();

        // 获取 .yes-screen 元素
        const yesScreen = document.querySelector('.yes-screen');
        if (yesScreen) {
          yesScreen.style.overflow = 'hidden'; // Prevent scrollbars during scaling FIRST
          // 设置过渡效果，确保动画平滑
          yesScreen.style.transition = 'transform 1s ease-in-out, width 1s ease-in-out, height 1s ease-in-out';
          yesScreen.style.transformOrigin = 'center center'; // 设置变换原点为中心
          // 应用缩放，宽度变为1.5倍，高度变为2倍
          yesScreen.style.transform = 'scale(1.5, 2)';
        }
        
        // 添加短暂延迟，让信封开启动画先执行
        setTimeout(() => {
          // 确保信纸内容可见
          if(yesScreen) {
              yesScreen.style.overflow = 'auto'; // THEN allow overflow for the scaled container
          }
          letter.style.display = 'block'; // Make letter visible before scrolling calculations
          letter.style.opacity = '1';
          letter.style.visibility = 'visible';
          
          // 创建信纸下方的按钮容器
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'memory-button-container';
          buttonContainer.style.position = 'fixed';
          buttonContainer.style.bottom = '50px';
          buttonContainer.style.left = '0';
          buttonContainer.style.width = '100%';
          buttonContainer.style.textAlign = 'center';
          buttonContainer.style.zIndex = '2500';
          buttonContainer.style.padding = '20px 0';
          
          // 创建记忆按钮
          const memoryButton = document.createElement('button');
          memoryButton.id = 'memoryButton';
          memoryButton.innerHTML = `<span style="margin-right: 8px;">❤️</span>时光琥珀<span style="margin-left: 8px;">❤️</span>`;
          memoryButton.style.background = 'linear-gradient(135deg, #ff7eb9, #ff65a3)';
          memoryButton.style.border = 'none';
          memoryButton.style.borderRadius = '25px';
          memoryButton.style.color = 'white';
          memoryButton.style.padding = '12px 24px';
          memoryButton.style.fontSize = '0.9em';
          memoryButton.style.fontWeight = 'bold';
          memoryButton.style.cursor = 'pointer';
          memoryButton.style.boxShadow = '0 4px 15px rgba(255, 105, 180, 0.4)';
          memoryButton.style.transition = 'all 0.3s ease';
          memoryButton.style.display = 'flex';
          memoryButton.style.alignItems = 'center';
          memoryButton.style.justifyContent = 'center';
          memoryButton.style.margin = '0 auto';
          
          // 添加按钮到容器
          buttonContainer.appendChild(memoryButton);
          
          // 添加容器到页面
          document.body.appendChild(buttonContainer);
          
          // 绑定记忆按钮点击事件
          setTimeout(() => {
            // 添加按钮悬停效果
            memoryButton.addEventListener('mouseover', function() {
              this.style.transform = 'scale(1.05)';
              this.style.boxShadow = '0 6px 20px rgba(255, 105, 180, 0.6)';
              this.style.background = 'linear-gradient(135deg, #ff65a3, #ff3d7f)';
            });
            
            memoryButton.addEventListener('mouseout', function() {
              this.style.transform = 'scale(1)';
              this.style.boxShadow = '0 4px 15px rgba(255, 105, 180, 0.4)';
              this.style.background = 'linear-gradient(135deg, #ff7eb9, #ff65a3)';
            });
            
            // 点击按钮直接进入美好回忆页面
            memoryButton.addEventListener('click', function() {
              // 保存当前音乐播放状态
              const bgMusic = document.getElementById('bgMusic');
              const musicToggle = document.getElementById('musicToggle');
              const wasPlaying = bgMusic && !bgMusic.paused;
              const currentTime = bgMusic ? bgMusic.currentTime : 0;
              const currentVolume = bgMusic ? bgMusic.volume : 0.5;
              
              // 创建过渡动画
              const transitionOverlay = document.createElement('div');
              transitionOverlay.style.position = 'fixed';
              transitionOverlay.style.top = '0';
              transitionOverlay.style.left = '0';
              transitionOverlay.style.width = '100%';
              transitionOverlay.style.height = '100%';
              transitionOverlay.style.backgroundColor = 'white';
              transitionOverlay.style.opacity = '0';
              transitionOverlay.style.transition = 'opacity 0.8s ease';
              transitionOverlay.style.zIndex = '5000';
              document.body.appendChild(transitionOverlay);
              
              // 执行淡入动画
              setTimeout(() => {
                transitionOverlay.style.opacity = '1';
                
                // 淡入完成后，切换到照片页面
                setTimeout(() => {
                  // 优化音频处理：先克隆音频元素，而不是移除再添加
                  let newBgMusic = null;
                  let newMusicToggle = null;
                  
                  if (bgMusic) {
                    // 克隆音频元素，保留所有属性
                    newBgMusic = bgMusic.cloneNode(true);
                    newBgMusic.id = 'bgMusic';
                    newBgMusic.currentTime = currentTime;
                    newBgMusic.volume = currentVolume;
                    document.body.appendChild(newBgMusic);
                  }
                  
                  if (musicToggle) {
                    // 克隆音乐控制按钮
                    newMusicToggle = musicToggle.cloneNode(true);
                    newMusicToggle.id = 'musicToggle';
                    document.body.appendChild(newMusicToggle);
                  }
                  
                  // 获取 .yes-screen 元素
                  const yesScreenContainer = document.querySelector('.yes-screen');
                  
                  // 现在可以安全地移除yes-screen容器
                  if (yesScreenContainer && yesScreenContainer.parentNode) {
                    yesScreenContainer.parentNode.removeChild(yesScreenContainer);
                  }
                  
                  // 移除原始按钮容器
                  const buttonContainer = document.querySelector('.memory-button-container');
                  if (buttonContainer && buttonContainer.parentNode) {
                    buttonContainer.parentNode.removeChild(buttonContainer);
                  }
                  
                  // 确保音乐状态保持不变
                  if (newBgMusic && wasPlaying) {
                    // 使用 setTimeout 延迟播放，避免浏览器音频上下文冲突
                    setTimeout(() => {
                      // 尝试继续播放
                      const playPromise = newBgMusic.play();
                      if (playPromise !== undefined) {
                        playPromise.catch(e => {
                          console.log('切换到图片页面后音频播放失败:', e);
                          // 如果播放失败，再次尝试
                          setTimeout(() => {
                            newBgMusic.play().catch(err => console.log('再次尝试播放失败:', err));
                          }, 500);
                        });
                      }
                    }, 100);
                  }
                  
                  // 重新绑定音乐控制按钮事件
                  if (newMusicToggle) {
                    newMusicToggle.addEventListener('click', function(e) {
                      e.stopPropagation();
                      if (newBgMusic) {
                        if (newBgMusic.paused) {
                          newBgMusic.play().then(() => {
                            isMusicPlaying = true;
                            updateMusicButtonStateForCollage(this);
                          }).catch(e => {
                            console.log('音频播放失败:', e);
                          });
                        } else {
                          newBgMusic.pause();
                          isMusicPlaying = false;
                          updateMusicButtonStateForCollage(this);
                        }
                      }
                    });
                    
                    // 更新按钮状态
                    isMusicPlaying = wasPlaying;
                    updateMusicButtonStateForCollage(newMusicToggle);
                  }
                  
                  // 显示图片拼贴
                  showImageCollage();
                  
                  // 执行淡出动画
                  setTimeout(() => {
                    transitionOverlay.style.opacity = '0';
                    
                    // 动画结束后移除过渡层
                    setTimeout(() => {
                      if (transitionOverlay.parentNode) {
                        transitionOverlay.parentNode.removeChild(transitionOverlay);
                      }
                    }, 800);
                  }, 200);
                }, 800);
              }, 10);
            });
          }, 500); // 给按钮绑定事件的延迟
          
          // 滚动到信纸位置
          setTimeout(() => {
            // Make the letter element itself scrollable
            letter.style.boxSizing = 'border-box'; 
            letter.style.overflowY = 'auto';
            letter.style.paddingBottom = '20px'; // Keep a small padding for the letter itself

            // Use requestAnimationFrame to ensure styles are applied and dimensions are updated
            requestAnimationFrame(() => {
              console.log(`[Scroll Diagnostics] Letter: scrollH=${letter.scrollHeight}, clientH=${letter.clientHeight}, scrollT=${letter.scrollTop}`);
              console.log(`[Scroll Diagnostics] YesScreen: scrollH=${yesScreen.scrollHeight}, clientH=${yesScreen.clientHeight}, scrollT=${yesScreen.scrollTop}, overflow=${yesScreen.style.overflow}`);
              if (letter.scrollHeight > letter.clientHeight) {
                const targetScrollTop = (letter.scrollHeight - letter.clientHeight) / 2;
                console.log(`[Scroll Diagnostics] Letter is scrollable. Attempting to auto-scroll to: ${targetScrollTop}`);
                if (targetScrollTop > 0) {
                  letter.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
                }
              } else {
                console.log('[Scroll Diagnostics] Letter content does not exceed its container height. Not scrollable or already fully visible.');
              }
            });
          }, 800);

          // After 5 seconds, fade out letter and show images
          // 注释掉自动跳转的代码，改为按钮触发
          /*
          setTimeout(() => {
            const yesScreenContainer = document.querySelector('.yes-screen');
            if (yesScreenContainer) {
              yesScreenContainer.style.transition = 'opacity 1s ease-out';
              yesScreenContainer.style.opacity = '0';
              yesScreenContainer.addEventListener('transitionend', () => {
                // 保存当前音乐播放状态
                const bgMusic = document.getElementById('bgMusic');
                const musicToggle = document.getElementById('musicToggle');
                const wasPlaying = bgMusic && !bgMusic.paused;
                const currentTime = bgMusic ? bgMusic.currentTime : 0;
                const currentVolume = bgMusic ? bgMusic.volume : 0.5;
                
                // 在移除页面前，先将音频和控制元素移至body直接子元素
                if (bgMusic && bgMusic.parentNode) {
                  bgMusic.parentNode.removeChild(bgMusic);
                  document.body.appendChild(bgMusic);
                }
                
                if (musicToggle && musicToggle.parentNode) {
                  musicToggle.parentNode.removeChild(musicToggle);
                  document.body.appendChild(musicToggle);
                }
                
                // 现在可以安全地移除yes-screen容器
                if (yesScreenContainer.parentNode) {
                  yesScreenContainer.parentNode.removeChild(yesScreenContainer);
                }
                
                // 确保音乐状态保持不变
                if (bgMusic && wasPlaying) {
                  bgMusic.currentTime = currentTime;
                  bgMusic.volume = currentVolume;
                  // 尝试继续播放
                  const playPromise = bgMusic.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(e => {
                      console.log('切换到图片页面后音频播放失败:', e);
                    });
                  }
                }
                
                // 显示图片拼贴
                showImageCollage();
              }, { once: true });
            }
          }, 5000); // 5 seconds delay
          */

        }, 300); // 等待信封开启动画
      }, 500); // 等待按钮动画完成
    });
  }
}

// 在创建图片拼贴前添加一个函数来处理音乐控制元素的位置和样式
function setupMusicControlForCollage() {
  const musicControl = document.getElementById('musicToggle');
  const bgMusicElement = document.getElementById('bgMusic');
  
  if (musicControl) {
    // 确保音乐控制按钮样式适合在图片拼贴上显示
    musicControl.style.position = 'fixed';
    musicControl.style.top = '20px';
    musicControl.style.right = '20px';
    musicControl.style.zIndex = '3000'; // 确保在最上层
    musicControl.style.background = 'rgba(255, 255, 255, 0.7)';
    musicControl.style.borderRadius = '50%';
    musicControl.style.width = '40px';
    musicControl.style.height = '40px';
    musicControl.style.display = 'flex';
    musicControl.style.justifyContent = 'center';
    musicControl.style.alignItems = 'center';
    musicControl.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    musicControl.style.cursor = 'pointer';
    
    // 移除可能存在的旧事件监听器
    const newMusicControl = musicControl.cloneNode(true);
    if (musicControl.parentNode) {
      musicControl.parentNode.replaceChild(newMusicControl, musicControl);
    }
    
    // 重新绑定音乐控制事件，确保在新页面也能正常工作
    newMusicControl.addEventListener('click', function(e) {
      e.stopPropagation();
      if (bgMusicElement) {
        if (bgMusicElement.paused) {
          bgMusicElement.play().then(() => {
            isMusicPlaying = true;
            updateMusicButtonStateForCollage(this);
          }).catch(e => {
            console.log('音频播放失败:', e);
          });
        } else {
          bgMusicElement.pause();
          isMusicPlaying = false;
          updateMusicButtonStateForCollage(this);
        }
      }
    });
    
    // 初始更新按钮状态
    updateMusicButtonStateForCollage(newMusicControl);
  }
  
  // 确保音乐元素存在并继续播放
  if (bgMusicElement) {
    if (!bgMusicElement.paused) {
      isMusicPlaying = true;
    } else {
      isMusicPlaying = false;
    }
  }
}

// 专门为拼贴页面更新音乐按钮状态
function updateMusicButtonStateForCollage(controlBtn) {
  if (!controlBtn) return;
  
  const icon = controlBtn.querySelector("i");
  if (!icon) return;
  
  if (isMusicPlaying) {
    icon.className = "fas fa-music"; // 播放中图标
  } else {
    icon.className = "fas fa-volume-mute"; // 静音图标
  }
}

// 修改showImageCollage函数，在开始时调用音乐控制设置
function showImageCollage() {
  // 首先设置音乐控制
  setupMusicControlForCollage();
  
  let imageCollageContainer = document.getElementById('image-collage-container');
  if (!imageCollageContainer) {
    imageCollageContainer = document.createElement('div');
    imageCollageContainer.id = 'image-collage-container';
    imageCollageContainer.style.position = 'fixed';
    imageCollageContainer.style.top = '0';
    imageCollageContainer.style.left = '0';
    imageCollageContainer.style.width = '100vw';
    imageCollageContainer.style.height = '100vh';
    imageCollageContainer.style.backgroundColor = 'rgba(240, 240, 240, 0.9)';
    imageCollageContainer.style.zIndex = '2000';
    imageCollageContainer.style.overflow = 'hidden';
    imageCollageContainer.style.padding = '20px';
    imageCollageContainer.style.boxSizing = 'border-box';
    imageCollageContainer.style.display = 'flex';
    imageCollageContainer.style.flexDirection = 'column';
    
    document.body.appendChild(imageCollageContainer);
  }
  imageCollageContainer.innerHTML = '';
  
  // 创建标题
  const title = document.createElement('h2');
  // title.textContent = '美好回忆';
  title.style.textAlign = 'center';
  title.style.marginBottom = '20px';
  title.style.color = '#7bba8e';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '28px';
  title.style.textShadow = '1px 1px 3px rgba(0,0,0,0.1)';
  title.style.zIndex = '10';
  title.style.position = 'relative';
  
  // 创建照片展示区域
  const collageArea = document.createElement('div');
  collageArea.style.position = 'relative';
  collageArea.style.flex = '1';
  collageArea.style.width = '100%';
  collageArea.style.overflow = 'hidden';
  
  imageCollageContainer.appendChild(title);
  imageCollageContainer.appendChild(collageArea);

  // 创建放大查看的模态框
  const modalContainer = document.createElement('div');
  modalContainer.id = 'image-modal';
  modalContainer.style.position = 'fixed';
  modalContainer.style.top = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100vw';
  modalContainer.style.height = '100vh';
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  modalContainer.style.zIndex = '3500';
  modalContainer.style.display = 'none';
  modalContainer.style.justifyContent = 'center';
  modalContainer.style.alignItems = 'center';
  modalContainer.style.cursor = 'pointer';
  
  const modalImage = document.createElement('img');
  modalImage.style.maxWidth = '90vw';
  modalImage.style.maxHeight = '90vh';
  modalImage.style.objectFit = 'contain';
  modalImage.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.5)';
  modalImage.style.transform = 'scale(0.9)';
  modalImage.style.transition = 'transform 0.3s ease';
  
  const closeButton = document.createElement('div');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '30px';
  closeButton.style.fontSize = '40px';
  closeButton.style.color = 'white';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '3600';
  
  modalContainer.appendChild(modalImage);
  modalContainer.appendChild(closeButton);
  document.body.appendChild(modalContainer);
  
  // 关闭模态框事件
  modalContainer.addEventListener('click', function() {
    modalContainer.style.display = 'none';
    modalImage.style.transform = 'scale(0.9)';
  });
  
  closeButton.addEventListener('click', function(e) {
    e.stopPropagation();
    modalContainer.style.display = 'none';
  });
  
  // 阻止点击图片时关闭模态框
  modalImage.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  const imageUrls = [];
  for (let i = 1; i <= 9; i++) {
    imageUrls.push(`images/${i}.jpg`);
  }

  // 跟踪已查看的照片
  const viewedImages = new Set();
  
  // 检查是否所有照片都已查看
  function checkAllImagesViewed() {
    if (viewedImages.size === imageUrls.length) {
      // 所有照片都已查看，显示祝福标题
      showFinalMessage();
    }
  }
  
  // 添加图片加载错误处理
  const imageLoadPromises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({img, url});
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        // 尝试使用相对路径重新加载
        const retryUrl = `./${url}`;
        const retryImg = new Image();
        retryImg.onload = () => resolve({img: retryImg, url: retryUrl});
        retryImg.onerror = () => {
          console.error(`Still failed to load image after retry: ${url}`);
          // 创建一个占位图像，避免整个加载失败
          const placeholderImg = new Image();
          placeholderImg.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 300 200%22%3E%3Crect width%3D%22300%22 height%3D%22200%22 fill%3D%22%23cccccc%22%3E%3C%2Frect%3E%3Ctext x%3D%22150%22 y%3D%22100%22 font-size%3D%2220%22 text-anchor%3D%22middle%22 alignment-baseline%3D%22middle%22 fill%3D%22%23666666%22%3E图片加载失败%3C%2Ftext%3E%3C%2Fsvg%3E';
          resolve({img: placeholderImg, url: url, isPlaceholder: true});
        };
        retryImg.src = retryUrl;
      };
      img.src = url;
    });
  });

  Promise.all(imageLoadPromises).then(loadedImages => {
    // 容器尺寸
    const containerWidth = collageArea.offsetWidth;
    const containerHeight = collageArea.offsetHeight || window.innerHeight - 100; // 减去标题和边距
    
    // 统一照片尺寸 - 使所有照片大小相同
    const photoWidth = containerWidth * 0.25; // 统一宽度为容器宽度的25%
    const photoHeight = photoWidth * 0.75; // 统一高度，保持3:4的比例
    
    // 创建随机布局
    loadedImages.forEach(({img, url}, index) => {
      // 创建图片容器
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'absolute';
      imgContainer.style.overflow = 'hidden';
      imgContainer.style.borderRadius = '10px';
      imgContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
      imgContainer.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      imgContainer.style.cursor = 'pointer';
      imgContainer.style.transform = 'scale(0) rotate(0deg)';
      imgContainer.style.opacity = '0';
      imgContainer.style.zIndex = index + 1;
      imgContainer.style.width = `${photoWidth}px`;
      imgContainer.style.height = `${photoHeight}px`;
      
      // 随机位置 - 确保完全在可视区域内
      const maxLeft = containerWidth - photoWidth;
      const maxTop = containerHeight - photoHeight;
      
      // 创建一个杂乱的分布，但避免照片过度重叠
      // 将容器分为虚拟的3x3网格，然后在每个区域内随机放置
      const gridX = index % 3; // 0, 1, 2
      const gridY = Math.floor(index / 3); // 0, 1, 2
      
      const cellWidth = maxLeft / 2;
      const cellHeight = maxTop / 2;
      
      // 计算基础位置 (网格中心位置)
      let baseLeft = gridX * cellWidth;
      let baseTop = gridY * cellHeight;
      
      // 添加随机偏移，但不超出容器
      const offsetRange = Math.min(cellWidth, cellHeight) * 0.6; // 增大偏移范围使排列更杂乱
      const left = Math.max(0, Math.min(maxLeft, baseLeft + (Math.random() - 0.5) * offsetRange));
      const top = Math.max(0, Math.min(maxTop, baseTop + (Math.random() - 0.5) * offsetRange));
      
      // 随机旋转 -20到20度，增加角度范围
      const rotation = (Math.random() - 0.5) * 40;
      
      imgContainer.style.left = `${left}px`;
      imgContainer.style.top = `${top}px`;
      
      // 创建图片元素
      const imgElement = document.createElement('img');
      imgElement.src = url;
      imgElement.style.width = '100%';
      imgElement.style.height = '100%';
      imgElement.style.objectFit = 'cover';
      
      // 添加悬停效果
      imgContainer.addEventListener('mouseenter', function() {
        this.style.transform = `scale(1.15) rotate(${rotation}deg)`; // 增大悬停时的放大效果
        this.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'; // 增强阴影效果
        this.style.zIndex = 100; // 确保悬停的图片在最上层
      });
      
      imgContainer.addEventListener('mouseleave', function() {
        this.style.transform = `scale(1) rotate(${rotation}deg)`;
        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
        this.style.zIndex = index + 1; // 恢复原来的层级
      });
      
      // 点击放大查看
      imgContainer.addEventListener('click', function() {
        modalImage.src = url;
        modalContainer.style.display = 'flex';
        
        // 记录该图片已被查看
        viewedImages.add(url);
        
        // 检查是否所有图片都已查看
        checkAllImagesViewed();
        
        setTimeout(() => {
          modalImage.style.transform = 'scale(1)';
        }, 50);
      });
      
      imgContainer.appendChild(imgElement);
      collageArea.appendChild(imgContainer);
      
      // 错开时间依次显示每张图片，增加间隔时间制造更明显的动画效果
      setTimeout(() => {
        imgContainer.style.opacity = '1';
        imgContainer.style.transform = `scale(1) rotate(${rotation}deg)`;
      }, 100 + index * 200);
    });
  }).catch(error => {
    console.error("Error loading one or more images for collage:", error);
    collageArea.innerHTML = '<p style="color: red; text-align: center; margin-top: 50px; position: absolute; width: 100%;">Error loading images. Please try again later.</p>';
  });
}

// 3D爱心花瓣飘落动画
function startHeartAnimation() {
  const heartCanvas = document.getElementById("heartCanvas");
  heartCanvas.style.display = "block";
  
  // 设置页面背景为淡粉绿色
  document.querySelector(".yes-screen").style.backgroundColor = "rgba(215, 240, 215, 0.7)"; // 淡粉绿色背景
  
  // Three.js 初始化
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // 透明背景
  heartCanvas.appendChild(renderer.domElement);
  
  // 相机位置
  camera.position.z = 25;
  
  // 添加环境光增强颜色
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // 创建目标爱心形状的点
  const targetHeartPoints = [];
  const heartSize = 0.5;
  const heartPointCount = 300; // 更多的目标点，使爱心更平滑
  
  // 按照心形方程生成点
  for (let i = 0; i < heartPointCount; i++) {
    const t = i / heartPointCount;
    const point = heartShape(t, heartSize);
    targetHeartPoints.push({
      x: point.x,
      y: point.y,
      z: 0 // 使z=0，让爱心更平面化
    });
  }
  
  // 创建光带
  function createLightTrails(scene) {
    const trailsCount = 12; // 增加环带数量
    const trails = [];
    
    for (let i = 0; i < trailsCount; i++) {
      const trailGeometry = new THREE.BufferGeometry();
      const trailVertices = [];
      
      // 创建彩虹色爱心光环效果
      const radius = 15 + i * 1.8; // 稍微减小间距，显示更多环
      const segments = 300; // 分段，使线条平滑
      
      // 创建主环带（爱心形状）
      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        // 使用心形方程缩放，使每层环带成为不同大小的心形
        const point = heartShape(t, 0.8 + i * 0.15);
        const x = point.x * 1.6; // 加宽爱心
        const y = point.y * 1.6;
        // 添加波浪效果，使z轴变化更明显
        const waveAmplitude = 0.8 + Math.sin(i * 0.5) * 0.3;
        const z = Math.sin(j / (8 + i) + i * 0.2) * waveAmplitude;
        trailVertices.push(x, y, z);
      }
      
      trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailVertices, 3));
      
      // 从外到内应用彩虹色 - 最外层是红色，向内依次是橙黄绿蓝靛紫
      // 反转索引计算，使最外层（最大索引）获得第一个颜色（红色）
      const colorIndex = (trailsCount - 1 - i) % colors.length;
      const trailColor = colors[colorIndex];
      
      const trailMaterial = new THREE.LineBasicMaterial({
        color: trailColor,
        transparent: true,
        opacity: 0.75, // 增加不透明度
        blending: THREE.AdditiveBlending,
        linewidth: 24 // 线宽加粗
      });
      
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      trail.userData = {
        rotationSpeed: {
          x: Math.sin(i * 0.4) * 0.0001, // 添加x轴小旋转
          y: Math.cos(i * 0.3) * 0.0001, // 添加y轴小旋转
          z: (Math.random() - 0.5) * 0.0005 // z轴上有微小旋转
        },
        color: trailColor,
        colorIndex: colorIndex,
        pulseSpeed: 0.3 + Math.random() * 0.3, // 脉动速度
        rainbow: {
          active: true,
          speed: 0.0005 + i * 0.00005, // 彩虹变色速度
          phase: i * (Math.PI / 6) // 不同环带的相位差
        }
      };
      
      scene.add(trail);
      trails.push(trail);
    }
    
    return trails;
  }
  
  // 创建粒子
  function createParticles(scene, targetHeartPoints) {
    const particles = [];
    const particleCount = 3000; // 增加粒子数量
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const particleSize = 0.2 + Math.random() * 0.1; // 更一致的粒子大小
      
      // 为每个粒子创建一个顶点
      const vertices = [0, 0, 0];
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      
      // 随机选择彩色
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const material = new THREE.PointsMaterial({
        color: color,
        size: particleSize,
        transparent: true,
        opacity: 0.9, // 增加不透明度
        blending: THREE.AdditiveBlending,
        depthTest: false,
        sizeAttenuation: true
      });
      
      const particle = new THREE.Points(geometry, material);
      
      // 随机初始位置 - 分散在上方
      particle.position.x = Math.random() * 40 - 20;
      particle.position.y = Math.random() * 30 + 15;
      particle.position.z = Math.random() * 6 - 3; // 减小z轴范围，使粒子更集中
      
      particle.userData = {
        originalSize: particleSize,
        velocity: {
          x: Math.random() * 0.03 - 0.015,
          y: -Math.random() * 0.08 - 0.04, // 向下飘落
          z: Math.random() * 0.02 - 0.01 // 减小z轴速度
        },
        targetPosition: targetHeartPoints[i % targetHeartPoints.length], // 确保每个粒子都有目标点
        phase: "falling",
        delay: Math.random() * 1000,
        startForming: false,
        flow: {
          amplitude: 0.03 + Math.random() * 0.05, // 减小流动幅度，使爱心更稳定
          frequency: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2
        },
        colorChange: {
          enabled: false, // 所有粒子都变色
          speed: 0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2
        }
      };
      
      scene.add(particle);
      particles.push(particle);
    }
    
    return particles;
  }
  
  // 创建光带和粒子
  const lightTrails = createLightTrails(scene);
  const hearts = createParticles(scene, targetHeartPoints);
  
  // 动画状态
  const animationState = {
    startTime: Date.now(),
    formingTime: 4000*2, // 缩短形成时间
    formingDuration: 2500*10 // 缩短过渡时间
  };
  
  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = Date.now();
    const elapsedTime = currentTime - animationState.startTime;
    
    // 更新环带
    lightTrails.forEach((trail, index) => {
      // 三轴微微旋转，创造动态效果
      trail.rotation.x += trail.userData.rotationSpeed.x;
      trail.rotation.y += trail.userData.rotationSpeed.y;
      trail.rotation.z += trail.userData.rotationSpeed.z;
      
      // 脉动效果 - 透明度变化
      const pulseOpacity = 0.75 + Math.sin(currentTime * 0.0005 * trail.userData.pulseSpeed) * 0.2;
      trail.material.opacity = pulseOpacity;
      
      // 彩虹色变换效果
      if (trail.userData.rainbow.active) {
        // 平滑过渡到下一个彩虹颜色
        const rainbow = trail.userData.rainbow;
        const timeOffset = currentTime * rainbow.speed + rainbow.phase;
        const colorShift = Math.sin(timeOffset) * 0.5 + 0.5; // 0到1之间
        
        // 计算当前颜色和下一个颜色
        const currentColorIndex = trail.userData.colorIndex;
        const nextColorIndex = (currentColorIndex + 1) % colors.length;
        
        // 混合两种颜色
        const currentColor = new THREE.Color(colors[currentColorIndex]);
        const nextColor = new THREE.Color(colors[nextColorIndex]);
        const mixedColor = currentColor.clone().lerp(nextColor, colorShift);
        
        // 应用混合颜色
        trail.material.color = mixedColor;
      }
    });
    
    hearts.forEach((particle) => {
      // 粒子脉动效果
      particle.material.size = particle.userData.originalSize * (1 + Math.sin(currentTime * 0.002) * 0.15);
      
      // 定期变色
      if (Math.random() < 0.01) { // 增加变色概率
        particle.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
      }
      
      if (elapsedTime < animationState.formingTime + particle.userData.delay) {
        // 自由飘落阶段
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;
        
        // 如果飘出画面底部，重置到顶部
        if (particle.position.y < -15) {
          particle.position.y = Math.random() * 20 + 15;
          particle.position.x = Math.random() * 40 - 20;
          particle.position.z = Math.random() * 6 - 3;
        }
      } else {
        // 形成爱心阶段
        if (!particle.userData.startForming) {
          particle.userData.startForming = true;
          particle.userData.formingStartTime = currentTime;
        }
        
        const formingElapsed = currentTime - particle.userData.formingStartTime;
        const progress = Math.min(1, formingElapsed / animationState.formingDuration);
        
        // 更平滑的缓动函数
        const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
        const easedProgress = easeOutQuint(progress);
        
        const target = particle.userData.targetPosition;
        
        if (progress < 1) {
          // 直接插值到目标位置
          particle.position.x = particle.position.x * (1 - easedProgress) + target.x * easedProgress;
          particle.position.y = particle.position.y * (1 - easedProgress) + target.y * easedProgress;
          particle.position.z = particle.position.z * (1 - easedProgress) + target.z * easedProgress;
        } else {
          // 爱心已经形成 - 使用更小的流动效果
          const flow = particle.userData.flow;
          const flowFactor = Math.sin(currentTime * 0.001 * flow.frequency + flow.phase);
          
          // 基于原始目标位置，应用小幅流动效果
          particle.position.x = target.x + flowFactor * flow.amplitude * 0.5;
          particle.position.y = target.y + Math.sin(currentTime * 0.0012 + flow.phase) * flow.amplitude * 0.5;
          particle.position.z = target.z + Math.cos(currentTime * 0.001 + flow.phase) * flow.amplitude * 0.2;
        }
      }
    });
    
    renderer.render(scene, camera);
  }
  
  // 窗口大小调整
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  window.addEventListener('resize', onWindowResize, false);
  
  // 开始动画
  animate();
}

// 添加烟花动画函数
function createFireworks() {
  const fireworksContainer = document.createElement('div');
  fireworksContainer.style.position = 'fixed';
  fireworksContainer.style.top = '0';
  fireworksContainer.style.left = '0';
  fireworksContainer.style.width = '100%';
  fireworksContainer.style.height = '100%';
  fireworksContainer.style.pointerEvents = 'none';
  fireworksContainer.style.zIndex = '2000';
  fireworksContainer.id = 'fireworks-container';
  document.body.appendChild(fireworksContainer);
  
  // 同时创建气球动画
  createBalloons();
  
  // 创建烟花效果
  const fireworksCount = 20; // 增加烟花数量从8个到20个
  const colors = [
    '#ff0000', // 红色
    '#ff69b4', // 粉红色
    '#ff8c00', // 橙色
    '#ffff00', // 黄色
    '#00ff00', // 绿色
    '#00ffff', // 青色
    '#0000ff', // 蓝色
    '#ff00ff', // 紫色
    '#ff3366', // 玫红色
    '#33cc33', // 亮绿色
    '#9900cc'  // 紫罗兰色
  ];
  
  // 发射多个烟花
  for (let i = 0; i < fireworksCount; i++) {
    setTimeout(() => {
      launchFirework(fireworksContainer, colors[i % colors.length]);
    }, i * 30); // 每隔30毫秒发射一个烟花
  }
  
  // 继续发射第二轮烟花
  setTimeout(() => {
    for (let i = 0; i < fireworksCount; i++) {
      setTimeout(() => {
        launchFirework(fireworksContainer, colors[(i + 5) % colors.length]);
      }, i * 40); // 第二轮稍微慢一点
    }
  }, 2000); // 2秒后发射第二轮
  
  // 继续发射第三轮烟花
  setTimeout(() => {
    for (let i = 0; i < fireworksCount; i++) {
      setTimeout(() => {
        launchFirework(fireworksContainer, colors[(i + 2) % colors.length]);
      }, i * 35); // 第三轮的间隔
    }
  }, 4500); // 4.5秒后发射第三轮
  
  // 延长时间后移除烟花容器
  setTimeout(() => {
    if (fireworksContainer && fireworksContainer.parentNode) {
      fireworksContainer.parentNode.removeChild(fireworksContainer);
    }
  }, 12000); // 延长到12秒
}

// 发射单个烟花
function launchFirework(container, color) {
  // 随机位置
  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight;
  const endX = startX + (Math.random() * 300 - 150); // 增加水平扩散范围
  const endY = Math.random() * window.innerHeight * 0.6; // 增加高度范围
  
  // 创建烟花轨迹
  const trail = document.createElement('div');
  trail.style.position = 'absolute';
  trail.style.width = '3px';
  trail.style.height = '3px';
  trail.style.borderRadius = '50%';
  trail.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  trail.style.boxShadow = `0 0 6px 2px ${color}`;
  trail.style.left = `${startX}px`;
  trail.style.top = `${startY}px`;
  trail.style.transition = 'all 0.8s ease-out';
  trail.style.opacity = '1';
  container.appendChild(trail);
  
  // 发射动画
  setTimeout(() => {
    trail.style.left = `${endX}px`;
    trail.style.top = `${endY}px`;
    
    // 爆炸效果
    setTimeout(() => {
      // 移除轨迹
      container.removeChild(trail);
      
      // 创建爆炸粒子
      const particleCount = 60 + Math.floor(Math.random() * 40); // 增加粒子数量
      for (let i = 0; i < particleCount; i++) {
        createParticle(container, endX, endY, color);
      }
    }, 800);
  }, 10);
}

// 创建爆炸粒子
function createParticle(container, x, y, color) {
  const particle = document.createElement('div');
  
  // 随机大小
  const size = 2 + Math.random() * 4;
  
  // 随机方向和距离
  const angle = Math.random() * Math.PI * 2;
  const distance = 70 + Math.random() * 100; // 增加爆炸范围
  const duration = 0.8 + Math.random() * 1.2; // 增加持续时间
  
  // 设置粒子样式
  particle.style.position = 'absolute';
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.borderRadius = '50%';
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 ${size * 2}px ${size}px ${color}`;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.opacity = '1';
  particle.style.transition = `all ${duration}s cubic-bezier(0.1, 0.9, 0.2, 1)`;
  container.appendChild(particle);
  
  // 粒子爆炸动画
  setTimeout(() => {
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;
    
    particle.style.left = `${destX}px`;
    particle.style.top = `${destY}px`;
    particle.style.opacity = '0';
    
    // 动画结束后移除粒子
    setTimeout(() => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }, duration * 1000);
  }, 10);
}

// 添加气球动画函数
function createBalloons() {
  const balloonsContainer = document.createElement('div');
  balloonsContainer.style.position = 'fixed';
  balloonsContainer.style.bottom = '0';
  balloonsContainer.style.left = '0';
  balloonsContainer.style.width = '100%';
  balloonsContainer.style.height = '100%';
  balloonsContainer.style.pointerEvents = 'none';
  balloonsContainer.style.zIndex = '1900'; // 在烟花下方一点
  balloonsContainer.id = 'balloons-container';
  document.body.appendChild(balloonsContainer);
  
  // 气球颜色
  const balloonColors = [
    '#ff6b6b', // 红色
    '#4ecdc4', // 青色
    '#ffe66d', // 黄色
    '#ff8364', // 橙色
    '#95e1d3', // 薄荷色
    '#a6b1e1', // 淡紫色
    '#f9c1bb', // 粉色
    '#c3aed6', // 淡紫色
    '#ffcb91', // 杏色
    '#43aa8b'  // 绿色
  ];
  
  // 创建多个气球
  const balloonCount = 25;
  
  for (let i = 0; i < balloonCount; i++) {
    setTimeout(() => {
      createSingleBalloon(balloonsContainer, balloonColors[i % balloonColors.length]);
    }, i * 200); // 每隔200毫秒释放一个气球
  }
  
  // 延时移除气球容器
  setTimeout(() => {
    if (balloonsContainer && balloonsContainer.parentNode) {
      balloonsContainer.parentNode.removeChild(balloonsContainer);
    }
  }, 15000); // 15秒后移除气球
}

// 创建单个气球
function createSingleBalloon(container, color) {
  // 创建气球元素
  const balloon = document.createElement('div');
  
  // 随机大小
  const size = 40 + Math.random() * 30;
  
  // 随机水平位置
  const leftPos = Math.random() * (window.innerWidth - size);
  
  // 设置气球样式
  balloon.style.position = 'absolute';
  balloon.style.width = `${size}px`;
  balloon.style.height = `${size * 1.2}px`;
  balloon.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%'; // 气球形状
  balloon.style.background = `radial-gradient(circle at 30% 30%, white, ${color})`;
  balloon.style.boxShadow = `inset -5px -5px 10px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.1)`;
  balloon.style.left = `${leftPos}px`;
  balloon.style.bottom = `-${size}px`; // 从屏幕下方开始
  balloon.style.transition = `transform ${10 + Math.random() * 5}s ease-out, bottom ${10 + Math.random() * 5}s ease-out, opacity 1s ease-in-out`;
  balloon.style.transform = 'translateY(0) rotate(0deg)';
  balloon.style.zIndex = Math.floor(Math.random() * 10) + 1900;
  
  // 添加气球线
  const string = document.createElement('div');
  string.style.position = 'absolute';
  string.style.width = '1px';
  string.style.height = `${30 + Math.random() * 20}px`;
  string.style.backgroundColor = 'rgba(0,0,0,0.3)';
  string.style.bottom = `-${30 + Math.random() * 20}px`;
  string.style.left = '50%';
  string.style.transform = 'translateX(-50%)';
  balloon.appendChild(string);
  
  // 添加气球结
  const knot = document.createElement('div');
  knot.style.position = 'absolute';
  knot.style.width = '6px';
  knot.style.height = '8px';
  knot.style.borderRadius = '50%';
  knot.style.backgroundColor = color;
  knot.style.bottom = `-8px`;
  knot.style.left = '50%';
  knot.style.transform = 'translateX(-50%)';
  balloon.appendChild(knot);
  
  // 添加到容器
  container.appendChild(balloon);
  
  // 添加轻微左右摇摆动画
  const swayAmount = 20 + Math.random() * 30;
  const swayDuration = 3 + Math.random() * 2;
  
  // 设置CSS动画
  balloon.style.animation = `balloonSway ${swayDuration}s ease-in-out infinite alternate`;
  
  // 如果还没有定义这个动画，添加到页面
  if (!document.querySelector('#balloonSwayAnimation')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'balloonSwayAnimation';
    styleSheet.textContent = `
      @keyframes balloonSway {
        0% { transform: translateX(-${swayAmount}px) rotate(-5deg); }
        100% { transform: translateX(${swayAmount}px) rotate(5deg); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
  
  // 气球上升动画
  setTimeout(() => {
    const finalHeight = window.innerHeight + size + 100; // 确保飞出屏幕
    balloon.style.bottom = `${finalHeight}px`;
    
    // 随机水平漂移
    const horizontalDrift = leftPos + (Math.random() * 100 - 50);
    balloon.style.left = `${Math.max(0, Math.min(window.innerWidth - size, horizontalDrift))}px`;
    
    // 随机旋转
    const rotation = (Math.random() * 10 - 5);
    balloon.style.transform = `rotate(${rotation}deg)`;
    
    // 气球飞完后移除
    setTimeout(() => {
      if (container.contains(balloon)) {
        balloon.style.opacity = '0';
        setTimeout(() => {
          if (container.contains(balloon)) {
            container.removeChild(balloon);
          }
        }, 1000);
      }
    }, 10000 + Math.random() * 3000);
  }, 10);
}

// 显示最终祝福信息
function showFinalMessage() {
  // 创建祝福消息容器
  const messageContainer = document.createElement('div');
  messageContainer.style.position = 'fixed';
  messageContainer.style.top = '50%';
  messageContainer.style.left = '50%';
  messageContainer.style.transform = 'translate(-50%, -50%) scale(0.1)';
  messageContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  messageContainer.style.padding = '30px 50px';
  messageContainer.style.borderRadius = '20px';
  messageContainer.style.boxShadow = '0 10px 40px rgba(255, 105, 180, 0.4)';
  messageContainer.style.textAlign = 'center';
  messageContainer.style.zIndex = '4000';
  messageContainer.style.opacity = '0';
  messageContainer.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  // 创建祝福文字
  const message = document.createElement('div');
  message.style.display = 'flex';
  message.style.flexDirection = 'column';
  message.style.alignItems = 'center';
  message.style.justifyContent = 'center';
  message.style.margin = '0';
  message.style.padding = '10px 20px';
  message.style.background = 'rgba(255, 255, 255, 0.2)';
  message.style.borderRadius = '15px';
  message.style.boxShadow = '0 8px 25px rgba(255, 105, 180, 0.3)';
  
  // 第一行文字
  const firstLine = document.createElement('h2');
  firstLine.textContent = '遇见你是我的幸运';
  firstLine.style.color = '#ff6b8b';
  firstLine.style.fontSize = '2em';
  firstLine.style.fontWeight = 'bold';
  firstLine.style.margin = '0 0 10px 0';
  firstLine.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  firstLine.style.background = 'linear-gradient(45deg, #ff6b8b, #ff8e9e)';
  firstLine.style.webkitBackgroundClip = 'text';
  firstLine.style.webkitTextFillColor = 'transparent';
  
  // 第二行文字
  const secondLine = document.createElement('h2');
  secondLine.textContent = '未来我们相片记录幸福到永远';
  secondLine.style.color = '#7bba8e';
  secondLine.style.fontSize = '1.8em';
  secondLine.style.fontWeight = 'bold';
  secondLine.style.margin = '0';
  secondLine.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  secondLine.style.background = 'linear-gradient(45deg,rgb(216, 59, 154),rgb(163, 57, 131))';
  secondLine.style.webkitBackgroundClip = 'text';
  secondLine.style.webkitTextFillColor = 'transparent';
  
  // 添加到消息容器
  message.appendChild(firstLine);
  message.appendChild(secondLine);
  
  // 添加装饰元素
  const leftHeart = document.createElement('span');
  leftHeart.textContent = '❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️';
  leftHeart.style.fontSize = '1.5em';
  leftHeart.style.marginRight = '15px';
  leftHeart.style.display = 'inline-block';
  leftHeart.style.animation = 'heartbeat 1.5s infinite';
  
  const rightHeart = document.createElement('span');
  rightHeart.textContent = '❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️';
  rightHeart.style.fontSize = '1.5em';
  rightHeart.style.marginLeft = '15px';
  rightHeart.style.display = 'inline-block';
  rightHeart.style.animation = 'heartbeat 1.5s infinite';
  
  // 创建心跳动画
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes heartbeat {
      0% { transform: scale(1); }
      25% { transform: scale(1.1); }
      50% { transform: scale(1); }
      75% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `;
  document.head.appendChild(styleSheet);
  
  // 组装消息
  messageContainer.appendChild(leftHeart);
  messageContainer.appendChild(message);
  messageContainer.appendChild(rightHeart);
  document.body.appendChild(messageContainer);
  
  // 添加浮动动画
  message.style.animation = 'float 3s ease-in-out infinite';
  
  // 显示消息
  setTimeout(() => {
    messageContainer.style.opacity = '1';
    messageContainer.style.transform = 'translate(-50%, -50%) scale(1)';
    
    // 创建彩色粒子效果
    createCelebrationParticles();
    
    // 10秒后淡出消息
    setTimeout(() => {
      messageContainer.style.opacity = '0';
      messageContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
      
      // 移除消息元素
      setTimeout(() => {
        if (messageContainer.parentNode) {
          messageContainer.parentNode.removeChild(messageContainer);
        }
      }, 1000);
    }, 10000);
  }, 100);
}

// 创建庆祝粒子效果
function createCelebrationParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.style.position = 'fixed';
  particlesContainer.style.top = '0';
  particlesContainer.style.left = '0';
  particlesContainer.style.width = '100%';
  particlesContainer.style.height = '100%';
  particlesContainer.style.pointerEvents = 'none';
  particlesContainer.style.zIndex = '3900';
  document.body.appendChild(particlesContainer);
  
  // 粒子颜色
  const particleColors = [
    '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8364', 
    '#95e1d3', '#a6b1e1', '#f9c1bb', '#c3aed6'
  ];
  
  // 创建粒子
  const particleCount = 100;
  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      
      // 随机大小
      const size = 5 + Math.random() * 10;
      
      // 随机位置
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      // 随机颜色
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      
      // 设置粒子样式
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = `0 0 ${size}px ${color}`;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.opacity = '0';
      
      // 随机动画持续时间
      const duration = 3 + Math.random() * 4;
      
      // 随机终点
      const endX = startX + (Math.random() * 200 - 100);
      const endY = startY + (Math.random() * 200 - 100);
      
      // 设置动画
      particle.style.transition = `all ${duration}s cubic-bezier(0.1, 0.9, 0.2, 1)`;
      
      // 添加到容器
      particlesContainer.appendChild(particle);
      
      // 开始动画
      setTimeout(() => {
        particle.style.opacity = '0.8';
        particle.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.1)`;
        
        // 动画结束后移除
        setTimeout(() => {
          if (particlesContainer.contains(particle)) {
            particlesContainer.removeChild(particle);
          }
          
          // 最后一个粒子移除后，移除容器
          if (i === particleCount - 1) {
            setTimeout(() => {
              if (particlesContainer.parentNode) {
                particlesContainer.parentNode.removeChild(particlesContainer);
              }
            }, duration * 1000);
          }
        }, duration * 1000);
      }, 10);
    }, i * 30);
  }
}