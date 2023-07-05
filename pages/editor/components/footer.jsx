import React, {
	forwardRef,
	useState,
	useEffect,
	useImperativeHandle,
} from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import PrimeReact, { locale, addLocale } from "primereact/api";
import {
	calculateResolution,
	isDeepEqual,
	moneyMask,
	print,
	roundToPower,
	toPower,
	useUtils,
} from "../../utils";
import ModelSelect from "./model_select";
import { useAthena } from "../../athena/athena_context";
import ModelCardDialog from "./model_card_dialog";
import { set } from "firebase/database";
import SpeechToText from "../../../componets/speech_to_text";
import AutoCompleteChips from "../../components/auto-complete-chips";
import { tokens } from "../../athena/interface_api";
import { Slider } from "primereact/slider";
import { Tooltip } from "primereact/tooltip";
import { InputTextarea } from "primereact/inputtextarea";
PrimeReact.ripple = false;

// forward ref can pass the object to parent component so it can be used as a ref
const EditorFooter = forwardRef((props, ref) => {
	const [models, set_models] = useState([]);
	const [view, set_view] = useState("menu");
	const { brain_data, select_model } = useAthena();
	const [active_index, set_active_index] = useState(null);
	const [info_dialog, set_info_dialog] = useState(null);
	const [vertical, set_vertical] = useState(true);
	const [vision, set_vision] = useState(null);
	const [last_vision, set_last_vision] = useState(null);
	const [resolution, set_resolution] = useState(512);
	const [selected_ratio, set_selected_ratio] = useState(0);
	const [aspect_ratios, set_aspect_ratios] = useState([
		[1, 1],
		[4, 5],
		[3, 4],
		[2, 3],
		[9, 16],
		[1, 2],
	]);
	const { is_mobile, orientation } = useUtils();
	// use imperative handle to pass the object's functions to parent component, so it can be used from a ref
	useImperativeHandle(
		ref,
		() => ({
			reset: () => reset(),
		}),
		[props.ref]
	); // whenever ref changes, reset will be called, works like a componentDidUpdate or useEffect
	// useImperativeHandle(ref, () =>{
	// 	return {
	// 		reset: () => reset(),
	// 	}
	// }, [props.ref]);
	function reset() {
		// console.log('Child component button clicked!');
		set_view("menu");
	}
	useEffect(() => {
		set_last_vision(props.imaginy_vision);
	}, []);
	function regenerate(test = true) {
		set_view("menu");
		// print(isDeepEqual(last_vision,vision))
		if (
			test == false ||
			last_vision == null ||
			isDeepEqual(last_vision, vision) == false
		) {
			props.onAction?.("generate");
			set_last_vision(props.imaginy_vision);
		}
	}

	function update_vision(value, key) {
		print((key, value));
		var _vision = { ...vision };
		_vision[key] = value;
		set_vision(_vision);
		props.set_vision(_vision);
	}

	const menu_buttons = [
		{
			label: "Ações",
			icon: "pi pi-ellipsis-h text-white",
			view: "options",
			items: [
				{
					label: "re-IMAGINY",
					emoji: "💡",
					icon: "pi pi-sync text-cyan-400",
					view: "generate",
					command: (valeu) => props.onAction?.(valeu),
					className: "text-green-600 sticky top-0 surface-0 left-0 shadow-8",
				},
				{
					label: "Xonei",
					emoji: "❤️‍🔥",
					icon: "pi pi-heart text-white",
					view: "loved",
					command: (valeu) => props.onAction?.(valeu),
				},
				{
					label: "Copiar",
					emoji: "🔗",
					icon: "pi pi-copy text-white",
					view: "copy",
					command: (valeu) => props.onAction?.(valeu),
				},
				{
					label: "Baixar",
					emoji: "💾",
					icon: "pi pi-download text-white",
					view: "download",
					command: (valeu) => props.onAction?.(valeu),
				},
				{
					label: "Excluir",
					emoji: "💔",
					icon: "pi pi-trash text-white",
					view: "delete",
					command: (valeu) => props.onAction?.(valeu),
				},
			],
		},
		{
			label: "Quadro",
			emoji: "🖼️",
			icon: "pi pi-image text-white",
			view: "frame",
		},
		{
			label: "Modelo",
			emoji: "🤖",
			icon: "pi pi-palette text-white",
			view: "model",
		},
		{
			label: "Descrição",
			emoji: "🧠",
			icon: "pi pi-comment text-white",
			view: "description",
		},
		{
			label: "Imagine",
			emoji: "💭",
			icon: "pi pi-eye text-white",
			view: "imagine",
		},
		{
			label: "Esqueça",
			emoji: "🚫",
			icon: "pi pi-ban text-white",
			view: "forget",
		},
	];
	useEffect(() => {
		// print(vision)
		if (brain_data && props.imaginy_vision)
			set_models(
				Object.entries(brain_data.image.generate).map((model, index) => {
					var _model = {
						...model[1],
						code: model[0],
						expanded: false,
						index: index,
					};
					if (props.imaginy_vision.model?.model == model[0])
						set_active_index(_model);
					return _model;
				})
			);
	}, [brain_data, vision]);

	useEffect(() => {
		// console.log(props.imaginy_vision)
		if (props.imaginy_vision) set_vision(props.imaginy_vision);
	}, [props.imaginy_vision]);

	function onSelect(value) {
		props.onSelect?.(value);
	}
	function mobile_button(data) {
		return (
			<div
				key={data.index}
				className={
					(data.className ? data.className : "") +
					" flex flex-wrap justify-content-center py-2 max-w-4rem max-h-4rem hover:bg-white-alpha-10 cursor-pointer "
				}
				onContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onClick={(e) => {
					if (data.command) {
						data.command(data.view);
					} else {
						if (view == data.view) {
							set_view("menu");
						} else {
							set_view(data.view);
						}
					}
				}}
			>
				<i
					className={`${data.icon} flex justify-content-center text-2xl w-4rem p-1`}
				/>
				{<h6 className=" text-center select-none">{data.label}</h6>}
			</div>
		);
	}

	// const menu_style = orientation=='portrait'?{
	// 		minHeight:"100vh",
	// }:{
	// 	minHeight:"100vh",
	// }
	let footer_class =
		"  select-none flex flex-wrap surface-card w-max align-items-start animation-duration-200 animation-iteration-1 " +
		(orientation == "portrait" ? "fadeindown" : "fadeinleft");
	var current_view = <></>;
	var current_menu = (
		<>
			<div
				key="footer_menu"
				className={
					(view == "menu" ? "surface-card" : "surface-50") +
					" z-1 shadow-8 flex flex-wrap " +
					(orientation == "portrait"
						? "w-screen h-4rem align-items-start justify-content-center"
						: "h-screen w-4rem align-items-center ")
				}
			>
				<div
					className={
						orientation == "portrait"
							? "flex w-min justify-content-between overflow-scroll hide-scroll"
							: "flex flex-wrap w-4rem h-min justify-content-center overflow-scroll hide-scroll"
					}
				>
					{menu_buttons.map((d, i) => mobile_button({ ...d, index: i }))}
				</div>
			</div>
		</>
	);

	const PanelHeader = (props) => {
		return (
			<div className="flex justify-content-between align-items-center w-full max-w-screen sticky top-0 z-3 h-3rem surface-card px-3 shadow-8">
				<Button
					icon={
						(orientation == "landscape" ? "pi pi-arrow-left" : "pi pi-times") +
						" font-bold"
					}
					className="p-button-lg p-button-text p-button-secondary shadow-none p-button-rounded p-3"
					onClick={() => {
						set_view("menu");
					}}
				/>
				<h3>{menu_buttons.find((data) => data.view == view)?.label}</h3>
				<Button
					icon="pi pi-check font-bold"
					className="p-button-lg p-button-text shadow-none p-button-rounded p-3"
					{...props}
				/>
			</div>
		);
	};

	switch (view) {
		case "menu":
			current_view = <></>;
			break;

		case "model": //Modelo
			current_view = (
				<>
					<ModelCardDialog
						vision={info_dialog ? { ...vision, model: info_dialog } : null}
						model={models[active_index]}
						onHide={() => {
							set_info_dialog(null);
						}}
						onSelect={(model) => {
							console.log(model);
							update_vision(models[model], "model");
							set_view("menu");
							regenerate(false);
							// set_active_index(model)
						}}
					/>

					<PanelHeader
						onClick={() => {
							console.log("regenerate");
							update_vision(active_index, "model");
							regenerate();
						}}
					/>
					<div
						// style={{ top: "33px", width: "100vw", position: "absolute" }}
						className="flex justify-content-center w-full max-w-screen"
					>
					<ModelSelect
						models={models}
						selected={active_index}
						onSelect={(value) => {
							print(value);
							if (active_index && isDeepEqual(active_index, value)) {
								print("open Dialog");
								set_info_dialog(value);
							}
							set_active_index(value);
						}}
						onDialog={(value) => {
							// print(value)
							set_info_dialog(value);
						}}
					/>
					</div>
				</>
			);
			break;

		case "frame": //Quadro
			current_view = (
				<>
					<PanelHeader onClick={regenerate} />
					<div
						style={{ top: "33px", width: "100%", position: "absolute" }}
						className="flex justify-content-center w-full"
					>
						<div
							className={
								(orientation == "landscape" ? "flex-wrap " : "") +
								"mt-3 z-2 flex w-30rem justify-content-between align-items-center"
							}
						>
							<Button
								label={
									!is_mobile || orientation == "landscape"
										? (() => {
												return (
													<label className="text-white ">
														{vertical ? "Vertical" : "Horizontal"}
													</label>
												);
											})()
										: null
								}
								icon={vertical ? "pi pi-arrows-v" : "pi pi-arrows-h"}
								className=" md:w-full py-1 px-3 p-button-rounded p-button-outlined border-2 bg-black-alpha-50 p-button-lg shadow-none"
								onClick={() => {
									set_vertical(!vertical);
									const r = [...aspect_ratios[selected_ratio]];
									update_vision(!vertical ? r : r.reverse(), "ratio");
								}}
							/>
							{/* <Tooltip target=".slider>.p-slider-handle" content={`${toPower(resolution)}px`} position="top" event="focus" /> */}
							<div
								className={
									(orientation == "landscape" ? "flex-wrap " : "") +
									"flex w-full justify-content-center gap-0 align-items-center h-full"
								}
							>
								<Slider
									step={1}
									value={Math.min(resolution, 100)}
									onChange={(e) => {
										// set_resolution(e.value)
										// console.log(e.value)
										set_resolution(e.value);
										// const res =toPower(e.value)
										// const ratio = {width:vision.ratio[0], height:vision.ratio[1]}
										// const maxMemory =1081600; // Maximum memory limit in bytes

										// // const dimentions = {width:maxWidth, height:maxHeight}

										// const maxResolution = calculateResolution(ratio)

										// console.log(maxResolution, vision.ratio)
										// const validAspectRatios = aspect_ratios.filter(aspectRatio => {
										// 	var d = vertical ? aspectRatio : [...aspectRatio].reverse()
										// 	let _resolution = calculateResolution({width:d[0], height:d[1]}, maxResolution);
										// 	const memoryUsage = _resolution.width * _resolution.height * 4; // Assuming 4 bytes per pixel (RGBA)
										// 	// console.log(memoryUsage)
										// 	return memoryUsage <= maxMemory;
										// });

										// console.log(JSON.stringify(validAspectRatios));
									}}
									onSlideEnd={(e) => {
										update_vision(e.value, "resolution");
									}}
									className="slider mx-3 mt-3 left-0 w-full "
								/>
								<h4 className="whitespace-nowrap p-0 m-0 ">
									{toPower(resolution)} px
								</h4>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap w-full h-min ">
						{orientation == "landscape" && (
							<div className=" w-max grid w-full mt-8 pt-5 ">
								{aspect_ratios.map((r, i) => {
									var d = vertical ? r : [...r].reverse();
									return (
										<div
											key={"ratio_" + i}
											className="flex flex-grow-1 w-full m-1 h-auto col-6 justify-content-center align-items-end"
										>
											<Button
												label={
													<label className="font-bold text-lg text-black vertical-align-middle whitespace-nowrap">{`${d[0]} : ${d[1]}`}</label>
												}
												className={
													(vertical ? "w-4rem" : "h-4rem") +
													" text-black flex p-button-secondary border-round-sm justify-content-centeralign-items-center p-0 m-0 " +
													(selected_ratio == i ? "bg-white" : "")
												}
												style={{ aspectRatio: `${d[0]}/${d[1]}` }}
												onClick={(e) => {
													set_selected_ratio(i);
													update_vision(d, "ratio");
												}}
											/>
										</div>
									);
								})}
							</div>
						)}
						{orientation == "portrait" && (
							<div className="flex gap-3 overflow-scroll hide-scroll px-3 align-items-center center justify-content-between w-auto max-w-screen-md">
								{aspect_ratios.map((r, i) => {
									var d = vertical ? r : [...r].reverse();
									return (
										<div key={"ratio_" + i}>
											<Button
												label={
													<label className="font-bold text-lg text-black vertical-align-middle whitespace-nowrap">{`${d[0]} : ${d[1]}`}</label>
												}
												className={
													(vertical ? "w-4rem" : "h-4rem") +
													" text-black flex p-button-secondary border-round-sm justify-content-center w-full align-items-center p-0 m-0 " +
													(selected_ratio == i ? "bg-white" : "")
												}
												style={{ aspectRatio: `${d[0]}/${d[1]}` }}
												onClick={(e) => {
													set_selected_ratio(i);
													update_vision(d, "ratio");
												}}
											/>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</>
			);
			break;
		case "description":
			current_view = (
				<>
					<PanelHeader onClick={regenerate} />
					<SpeechToText
						className="flex w-full overflow-scroll"
						value={vision?.description}
						uid="image_description"
						onChange={(text) => {
							// print(text)
							if (typeof text == "string") {
								update_vision(text, "description");
							} else if (typeof text == "object") {
								update_vision(text.textInput, "description");
							}
						}}
					/>
				</>
			);
			break;

		case "imagine":
			current_view = (
				<>
					<PanelHeader onClick={regenerate} />
					<div className="flex flex-wrap w-full max-w-screen h-max p-2">
						<AutoCompleteChips
							placeholder="Digite aqui ✍️"
							value={vision?.imagine || ""}
							tokens={tokens.imagine}
							onChange={(value) => {
								update_vision(value.join(", "), "imagine");
							}}
						/>
					</div>
				</>
			);
			break;

		case "forget":
			current_view = (
				<>
					<PanelHeader onClick={regenerate} />
					<div className="flex flex-wrap max-w-screen w-full h-max p-2">
						<AutoCompleteChips
							placeholder="Digite aqui ✍️"
							value={vision?.forget || ""}
							tokens={tokens.forget}
							onChange={(value) => {
								update_vision(value.join(", "), "forget");
							}}
						/>
					</div>
				</>
			);
			break;

		case "options":
			current_view = (
				<div className="w-full max-w-screen h-full">
					<PanelHeader onClick={regenerate} />
					<div className=" flex flex-wrap max-w-screen max-h-15rem w-full h-min p-2 justify-content-center gap-2">
						{menu_buttons[0].items.map((item, i) => {
							return (
								<Button
									key={"button_" + i}
									label={item.label}
									icon={item.icon + " text-3xl"}
									iconPos="right"
									className="p-button-lg p-button-text text-white shadow-none p-4 w-full"
									onClick={(e) => {
										item.command(item.view);
										set_view("menu");
									}}
								/>
							);
						})}
					</div>
				</div>
			);
			break;

		default:
			current_view = (
				<>
					<PanelHeader onClick={regenerate} />
				</>
			);
			break;
	}

	return (
		<div id="this_is_a_test">
			{view != "menu" && (
				<div
					key={"footer_" + view}
					className={footer_class + " overflow-scroll hide-scroll"}
					style={
						orientation == "landscape"
							? {
									height: "100vh",
									maxWidth: "20rem",
									minWidth: "15rem",
									left: "4rem",
									top: "0px",
									position: "fixed",
								}
							: {
								// minHeight: "100%",
								minWidth: "100vw",
								left: "4rem",
								top: "0px",
								minHeight: vertical ? "300px" : "222px",
							}
					}
				>
					{current_view}
				</div>
			)}
			{current_menu}
		</div>
	);
});

function ApplyButton(props) {
	return (
		<Button
			icon="pi pi-check font-bold"
			className="p-button-lg p-button-text shadow-none p-button-rounded p-3"
			{...props}
		/>
	);
}
EditorFooter.displayName = "myEditorFooter";
export default EditorFooter;
