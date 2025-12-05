<script lang="ts">
	import gsap from 'gsap';
	import confetti from 'canvas-confetti';

	let phoneNumber = $state('');
	let message = $state('');
	let pageWrapper: HTMLDivElement;

	function handleKeypadInput(num: string) {
		phoneNumber = (phoneNumber + num).slice(0, 10);
	}

	function handleBackspace() {
		phoneNumber = phoneNumber.slice(0, -1);
	}

	function toggleFullScreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	}

	async function savePhone() {
		const phoneRegex = /^09\d{8}$/;
		if (!phoneRegex.test(phoneNumber)) {
			message = '請輸入有效的手機號碼';
			for (let i = 0; i < 20; i++) {
				const question = document.createElement('img');
				question.src =
					'https://memeprod.sgp1.digitaloceanspaces.com/user-resource/4a42599768db38247148417f3d0702b2.png';
				question.style.position = 'fixed';
				question.style.width = '100px';
				question.style.height = '100px';
				question.style.zIndex = '1000';
				question.style.left = '50%';
				question.style.top = '50%';
				question.style.transform = 'translate(-50%, -50%)';
				document.body.appendChild(question);
				gsap.to(question, {
					y: `-=${150 + Math.random() * 69}`,
					x: `+=${(Math.random() - 0.5) * 150}`,
					scale: 0.8,
					opacity: 0,
					duration: 2.1,
					ease: 'power2.out',
					onComplete: () => question.remove()
				});
			}
			phoneNumber = '';
			return;
		}

		const res = await fetch('/api/phone', {
			method: 'POST',
			body: JSON.stringify({ phoneNumber }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (res.ok) {
			message = '號碼已儲存';
			phoneNumber = '';
			confetti({
				particleCount: 200,
				spread: 200,
				origin: { y: 0.6 }
			});
		} else {
			const data = await res.json();
			message = data.error || '儲存失敗';
			const tl = gsap.timeline();

			tl.to('body', {
				duration: 0.5,
				filter: 'hue-rotate(360deg) saturate(300%) blur(2px)',
				repeat: 1,
				yoyo: true,
				ease: 'none'
			});

			gsap.to(pageWrapper, {
				duration: 0.1,
				rotation: 360,
				scale: 0.8,
				repeat: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					gsap.to(pageWrapper, {
						duration: 0.5,
						rotation: 0,
						scale: 1,
						ease: 'back.out(1.7)'
					});
				}
			});
			phoneNumber = '';
		}
	}
</script>

<div class="flex h-screen w-full flex-col bg-gray-50 p-4" bind:this={pageWrapper}>
	<div class="flex h-full w-full flex-col gap-4">
		<div class="relative flex items-center justify-center">
			<h1 class="text-3xl font-bold text-gray-800">手機號碼登記</h1>
			<button
				onclick={toggleFullScreen}
				class="absolute right-0 rounded-lg p-2 text-gray-600 hover:bg-gray-200"
				aria-label="全螢幕"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
					/>
				</svg>
			</button>
		</div>

		<div class="relative">
			<input
				type="tel"
				bind:value={phoneNumber}
				placeholder="請輸入手機號碼"
				class="w-full rounded-xl border-2 border-gray-200 bg-white p-6 text-center text-5xl font-bold tracking-widest text-gray-800 focus:border-blue-500 focus:outline-none"
				readonly
			/>
		</div>

		{#if message}
			<div class="rounded-xl bg-blue-50 p-4 text-center text-xl font-bold text-blue-600">
				{message}
			</div>
		{/if}

		<div class="grid flex-1 grid-cols-3 grid-rows-4 gap-4">
			{#each Array(9) as _, i (i)}
				<button
					onpointerdown={() => handleKeypadInput((i + 1).toString())}
					class="rounded-xl bg-white text-5xl font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-100 active:scale-95 active:bg-gray-200"
				>
					{i + 1}
				</button>
			{/each}

			<button
				onpointerdown={handleBackspace}
				class="rounded-xl bg-red-100 text-3xl font-bold text-red-600 shadow-sm transition-colors hover:bg-red-200 active:scale-95"
			>
				刪除
			</button>

			<button
				onpointerdown={() => handleKeypadInput('0')}
				class="rounded-xl bg-white text-5xl font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-100 active:scale-95 active:bg-gray-200"
			>
				0
			</button>

			<button
				onpointerdown={savePhone}
				class="rounded-xl bg-green-500 text-3xl font-bold text-white shadow-sm transition-colors hover:bg-green-600 active:scale-95"
			>
				儲存
			</button>
		</div>
	</div>
</div>
