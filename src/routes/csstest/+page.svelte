<script lang="ts">
	import Help from "$lib/images/help.png";
	let hover: boolean = false;
	let hoverTimeout = setTimeout(() => {
		helpClicked = false;
	}, 3000);
	let helpClicked: boolean = false;
	$: {
		if (helpClicked) {
			clearTimeout(hoverTimeout);
			hoverTimeout = setTimeout(() => {
				helpClicked = false;
			}, 5000);
		}
	}

	let modalOpened: boolean = false;
</script>

<div class="m-1 fixed top-2 right-64 block">
	<img src={Help} alt="Help" class="w-auto h-20 opacity-50 transition-opacity"
		 on:mouseover={() => hover = true}
		 on:mouseleave={() => hover = false}
		 class:help-icon-hover={hover}
		 on:click={() => modalOpened=true}
	/>
</div>
<div class="opacity-0 fixed right-80 mr-7 top-9" class:box={helpClicked} class:sb1={helpClicked}>Drag a career to me for a detailed description!</div>
<div class="m-0 modal justify-center h-screen w-screen flex border-4 opacity-100 transition-opacity fixed top-0 left-0 z-40" class:modal-hidden={!modalOpened}>
	<div class="bg-white text-black p-5 shadow-2xl rounded-3xl modal-content">
		<h1 class="font-bold p-2 text-3xl">Career Name</h1>
		<hr class="my-2 h-0.5 bg-black"/>
		<p class="overflow-scroll h-[80%]">

		</p>
		<div class="fixed top-4 right-4 font-bold text-2xl" on:click={() => modalOpened=false}>x</div>
	</div>
</div>
<style>
	.help-icon-hover{
		opacity: 1;
		transition: 0.2s opacity ease-in-out;
	}
	.box {
		width: 300px;
		background: #00bfb6;
		padding: 20px;
		text-align: center;
		font-weight: 900;
		color: #fff;
		font-family: arial;
		opacity:1;
		transition: 0.2s opacity ease-in-out;
	}

	.sb1:before {
		content: "";
		width: 0px;
		height: 0px;
		position: absolute;
		border-left: 10px solid #00bfb6;
		border-right: 10px solid transparent;
		border-top: 10px solid #00bfb6;
		border-bottom: 10px solid transparent;
		right: -19px;
		top: 6px;
		opacity:1;
		transition: 0.2s opacity ease-in-out;
	}

	.modal{
		background: rgba(0,0,0,0.5);
		opacity: 1;
		transition: 0.2s all ease-in-out;

	}

	.modal-content{
		position: fixed;
		width:600px;
		height: 400px;
		top: 50%;
		left: 50%;
		margin-right: -50%;
		transform: translate(-50%, -50%);
	}

	.modal-hidden{
		display:none;
		opacity: 0;
		transition: 0.2s all ease-in-out;
	}
</style>