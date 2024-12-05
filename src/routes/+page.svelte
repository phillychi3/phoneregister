<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import confetti from 'canvas-confetti';

	let phoneNumber = '';
	let searchNumber = '';
	let message = '';
	let phoneList: string[] = [];
	let messageRef: HTMLDivElement;
	let pageWrapper: HTMLDivElement;

	const gifs = [
		'https://cdn.discordapp.com/emojis/1148841433252511764.webp?size=96&animated=true',
		'https://cdn.discordapp.com/emojis/1022531120476209272.webp?size=96&animated=true',
		'https://cdn.discordapp.com/emojis/763749259144986634.webp?size=96&animated=true',
		'https://cdn.discordapp.com/emojis/812992645302583306.webp?size=96&animated=true',
		'https://cdn.discordapp.com/emojis/1155147356891795456.webp?size=96&animated=true',
		'https://cdn.discordapp.com/emojis/1292512035350773880.webp?size=96&animated=true'
	];

	async function loadPhones() {
		const res = await fetch('/api/phone');
		if (res.ok) {
			const data = await res.json();
			phoneList = data.phones;
		}
	}

	onMount(() => {
		loadPhones();
	});

	async function savePhone() {
		const phoneRegex = /^09\d{8}$/;
		if (!phoneRegex.test(phoneNumber)) {
			message = '請輸入有效的手機號碼';
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

			loadPhones();
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
		}
	}

	async function deletePhone(number: string) {
		const res = await fetch(`/api/phone/${number}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			message = '號碼已刪除';

			loadPhones();
		} else {
			const data = await res.json();
			message = data.error || '刪除失敗';
		}
	}

	function getRandomPosition() {
		const positions = [
			{
				start: { x: '-50vw', y: 'random(-100, 100)vh' },
				end: { x: '100vw', y: 'random(-100, 100)vh' }
			},
			{
				start: { x: '150vw', y: 'random(-100, 100)vh' },
				end: { x: '0vw', y: 'random(-100, 100)vh' }
			},
			{
				start: { x: 'random(0, 100)vw', y: '-50vh' },
				end: { x: 'random(10, 90)vw', y: '60vh' }
			},
			{
				start: { x: 'random(0, 100)vw', y: '150vh' },
				end: { x: 'random(10, 90)vw', y: '-60vh' }
			}
		];
		return positions[Math.floor(Math.random() * positions.length)];
	}

	async function searchPhone() {
		const res = await fetch(`/api/phone/${searchNumber}`);
		const data = await res.json();

		message = data.exists ? '此號碼已存在' : '此號碼不存在';
		if (data.exists) {
			searchNumber = '';
			gsap.set(messageRef, {
				scale: 0,
				opacity: 0
			});
			messageRef.classList.add('rainbow-text');
			gsap.fromTo(
				messageRef,
				{ scale: 0, opacity: 0 },
				{
					scale: 1,
					opacity: 2,
					duration: 2,
					ease: 'back.out(2)'
				}
			);

			confetti({
				particleCount: 200,
				spread: 200,
				origin: { y: 0.6 }
			});

			for (let i = 0; i < 20; i++) {
				const gifContainer = document.createElement('div');
				const gifImg = document.createElement('img');

				gifImg.src = gifs[Math.floor(Math.random() * gifs.length)];
				gifImg.style.width = '100px';
				gifImg.style.height = '100px';

				gifContainer.style.position = 'fixed';
				gifContainer.style.zIndex = '1000';
				const pos = getRandomPosition();

				gifContainer.appendChild(gifImg);
				document.body.appendChild(gifContainer);

				gsap.set(gifContainer, {
					x: pos.start.x,
					y: pos.start.y,
					rotation: 'random(-180, 180)'
				});

				gsap.to(gifContainer, {
					x: pos.end.x,
					y: pos.end.y,
					rotation: 'random(-720, 720)',
					duration: 'random(1.5, 3)',
					ease: 'bounce.out',
					onComplete: () => {
						gsap.to(gifContainer, {
							opacity: 0,
							scale: 0,
							duration: 0.5,
							ease: 'back.in(1.7)',
							onComplete: () => gifContainer.remove()
						});
					}
				});
			}
		}
	}
</script>

<div bind:this={pageWrapper} class="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
	<h1 class="mb-6 text-2xl font-bold">手機號碼登記系統</h1>

	<div class="mb-6">
		<h2 class="mb-2 text-lg font-semibold">新增號碼</h2>
		<div class="flex gap-2">
			<input
				type="tel"
				bind:value={phoneNumber}
				placeholder="請輸入手機號碼"
				class="flex-1 rounded border px-3 py-2"
			/>
			<button
				on:click={savePhone}
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				儲存
			</button>
		</div>
	</div>

	<div class="mb-6">
		<h2 class="mb-2 text-lg font-semibold">查詢號碼</h2>
		<div class="flex gap-2">
			<input
				type="tel"
				bind:value={searchNumber}
				placeholder="請輸入手機號碼"
				class="flex-1 rounded border px-3 py-2"
			/>
			<button
				on:click={searchPhone}
				class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
			>
				查詢
			</button>
		</div>
	</div>
	{#if message}
		<div bind:this={messageRef} class="mt-4 rounded p-3 text-center text-2xl font-bold">
			{message}
		</div>
	{/if}
	{#if phoneList.length > 0}
		<div class="mb-6">
			<h2 class="mb-2 text-lg font-semibold">已儲存號碼</h2>
			<ul class="divide-y divide-gray-200">
				{#each phoneList as phone}
					<li class="flex items-center justify-between py-2">
						<span>{phone}</span>
						<button
							on:click={() => deletePhone(phone)}
							class="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
						>
							刪除
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	:global(.rainbow-text) {
		background-image: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #8000ff);
		background-size: 600% 100%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: rainbow-text 3s linear infinite;
	}

	@keyframes rainbow-text {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 600% 50%;
		}
	}
</style>
